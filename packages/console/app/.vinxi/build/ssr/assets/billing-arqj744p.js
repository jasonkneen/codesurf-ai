import { Stripe } from "stripe";
import { D as Database } from "./workspace.sql-DMfPBlPl.js";
import { B as BillingTable, P as PaymentTable, U as UsageTable } from "./billing.sql-DzjsSlDR.js";
import { A as Actor, I as Identifier } from "./key.sql-B-kRFiGf.js";
import { f as fn } from "./fn-DkMgaEh2.js";
import { z } from "zod";
import { R as Resource } from "./resource.cloudflare-Mzu_X_uv.js";
import { U as User } from "./user-CzX0rSuB.js";
import { eq, sql } from "drizzle-orm";
function centsToMicroCents(amount) {
  return Math.round(amount * 1e6);
}
var Billing;
((Billing2) => {
  Billing2.ITEM_CREDIT_NAME = "opencode credits";
  Billing2.ITEM_FEE_NAME = "processing fee";
  Billing2.RELOAD_AMOUNT = 20;
  Billing2.RELOAD_AMOUNT_MIN = 10;
  Billing2.RELOAD_TRIGGER = 5;
  Billing2.RELOAD_TRIGGER_MIN = 5;
  Billing2.stripe = () => new Stripe(Resource.STRIPE_SECRET_KEY.value, {
    apiVersion: "2025-03-31.basil",
    httpClient: Stripe.createFetchHttpClient()
  });
  Billing2.get = async () => {
    return Database.use(async (tx) => tx.select({
      customerID: BillingTable.customerID,
      paymentMethodID: BillingTable.paymentMethodID,
      paymentMethodType: BillingTable.paymentMethodType,
      paymentMethodLast4: BillingTable.paymentMethodLast4,
      balance: BillingTable.balance,
      reload: BillingTable.reload,
      reloadAmount: BillingTable.reloadAmount,
      reloadTrigger: BillingTable.reloadTrigger,
      monthlyLimit: BillingTable.monthlyLimit,
      monthlyUsage: BillingTable.monthlyUsage,
      timeMonthlyUsageUpdated: BillingTable.timeMonthlyUsageUpdated,
      reloadError: BillingTable.reloadError,
      timeReloadError: BillingTable.timeReloadError
    }).from(BillingTable).where(eq(BillingTable.workspaceID, Actor.workspace())).then((r) => r[0]));
  };
  Billing2.payments = async () => {
    return await Database.use((tx) => tx.select().from(PaymentTable).where(eq(PaymentTable.workspaceID, Actor.workspace())).orderBy(sql`${PaymentTable.timeCreated} DESC`).limit(100));
  };
  Billing2.usages = async () => {
    return await Database.use((tx) => tx.select().from(UsageTable).where(eq(UsageTable.workspaceID, Actor.workspace())).orderBy(sql`${UsageTable.timeCreated} DESC`).limit(100));
  };
  Billing2.calculateFeeInCents = (x) => {
    return Math.round((x + 30) / 0.956 * 0.044 + 30);
  };
  Billing2.reload = async () => {
    const billing = await Database.use((tx) => tx.select({
      customerID: BillingTable.customerID,
      paymentMethodID: BillingTable.paymentMethodID,
      reloadAmount: BillingTable.reloadAmount
    }).from(BillingTable).where(eq(BillingTable.workspaceID, Actor.workspace())).then((rows) => rows[0]));
    const customerID = billing.customerID;
    const paymentMethodID = billing.paymentMethodID;
    const amountInCents = (billing.reloadAmount ?? Billing2.RELOAD_AMOUNT) * 100;
    const paymentID = Identifier.create("payment");
    let invoice;
    try {
      const draft = await Billing2.stripe().invoices.create({
        customer: customerID,
        auto_advance: false,
        default_payment_method: paymentMethodID,
        collection_method: "charge_automatically",
        currency: "usd"
      });
      await Billing2.stripe().invoiceItems.create({
        amount: amountInCents,
        currency: "usd",
        customer: customerID,
        invoice: draft.id,
        description: Billing2.ITEM_CREDIT_NAME
      });
      await Billing2.stripe().invoiceItems.create({
        amount: (0, Billing2.calculateFeeInCents)(amountInCents),
        currency: "usd",
        customer: customerID,
        invoice: draft.id,
        description: Billing2.ITEM_FEE_NAME
      });
      await Billing2.stripe().invoices.finalizeInvoice(draft.id);
      invoice = await Billing2.stripe().invoices.pay(draft.id, {
        off_session: true,
        payment_method: paymentMethodID,
        expand: ["payments"]
      });
      if (invoice.status !== "paid" || invoice.payments?.data.length !== 1) throw new Error(invoice.last_finalization_error?.message);
    } catch (e) {
      console.error(e);
      await Database.use((tx) => tx.update(BillingTable).set({
        reloadError: e.message ?? "Payment failed.",
        timeReloadError: sql`now()`
      }).where(eq(BillingTable.workspaceID, Actor.workspace())));
      return;
    }
    await Database.transaction(async (tx) => {
      await tx.update(BillingTable).set({
        balance: sql`${BillingTable.balance} + ${centsToMicroCents(amountInCents)}`,
        reloadError: null,
        timeReloadError: null
      }).where(eq(BillingTable.workspaceID, Actor.workspace()));
      await tx.insert(PaymentTable).values({
        workspaceID: Actor.workspace(),
        id: paymentID,
        amount: centsToMicroCents(amountInCents),
        invoiceID: invoice.id,
        paymentID: invoice.payments?.data[0].payment.payment_intent,
        customerID
      });
    });
  };
  Billing2.setMonthlyLimit = fn(z.number(), async (input) => {
    return await Database.use((tx) => tx.update(BillingTable).set({
      monthlyLimit: input
    }).where(eq(BillingTable.workspaceID, Actor.workspace())));
  });
  Billing2.generateCheckoutUrl = fn(z.object({
    successUrl: z.string(),
    cancelUrl: z.string(),
    amount: z.number().optional()
  }), async (input) => {
    const user = Actor.assert("user");
    const {
      successUrl,
      cancelUrl,
      amount
    } = input;
    if (amount !== void 0 && amount < Billing2.RELOAD_AMOUNT_MIN) {
      throw new Error(`Amount must be at least $${Billing2.RELOAD_AMOUNT_MIN}`);
    }
    const email = await User.getAuthEmail(user.properties.userID);
    const customer = await Billing2.get();
    const amountInCents = (amount ?? customer.reloadAmount ?? Billing2.RELOAD_AMOUNT) * 100;
    const session = await Billing2.stripe().checkout.sessions.create({
      mode: "payment",
      billing_address_collection: "required",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: Billing2.ITEM_CREDIT_NAME
          },
          unit_amount: amountInCents
        },
        quantity: 1
      }, {
        price_data: {
          currency: "usd",
          product_data: {
            name: Billing2.ITEM_FEE_NAME
          },
          unit_amount: (0, Billing2.calculateFeeInCents)(amountInCents)
        },
        quantity: 1
      }],
      ...customer.customerID ? {
        customer: customer.customerID,
        customer_update: {
          name: "auto"
        }
      } : {
        customer_email: email,
        customer_creation: "always"
      },
      currency: "usd",
      invoice_creation: {
        enabled: true
      },
      payment_intent_data: {
        setup_future_usage: "on_session"
      },
      payment_method_types: ["card"],
      payment_method_data: {
        allow_redisplay: "always"
      },
      tax_id_collection: {
        enabled: true
      },
      metadata: {
        workspaceID: Actor.workspace(),
        amount: amountInCents.toString()
      },
      success_url: successUrl,
      cancel_url: cancelUrl
    });
    return session.url;
  });
  Billing2.generateSessionUrl = fn(z.object({
    returnUrl: z.string()
  }), async (input) => {
    const {
      returnUrl
    } = input;
    const customer = await Billing2.get();
    if (!customer?.customerID) {
      throw new Error("No stripe customer ID");
    }
    const session = await Billing2.stripe().billingPortal.sessions.create({
      customer: customer.customerID,
      return_url: returnUrl
    });
    return session.url;
  });
  Billing2.generateReceiptUrl = fn(z.object({
    paymentID: z.string()
  }), async (input) => {
    const {
      paymentID
    } = input;
    const intent = await Billing2.stripe().paymentIntents.retrieve(paymentID);
    if (!intent.latest_charge) throw new Error("No charge found");
    const charge = await Billing2.stripe().charges.retrieve(intent.latest_charge);
    if (!charge.receipt_url) throw new Error("No receipt URL found");
    return charge.receipt_url;
  });
})(Billing || (Billing = {}));
export {
  Billing as B,
  centsToMicroCents as c
};
