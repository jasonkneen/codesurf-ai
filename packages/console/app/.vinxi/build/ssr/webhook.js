import { B as Billing, c as centsToMicroCents } from "./assets/billing-arqj744p.js";
import { D as Database } from "./assets/workspace.sql-DMfPBlPl.js";
import { B as BillingTable, P as PaymentTable } from "./assets/billing.sql-DzjsSlDR.js";
import { A as Actor, I as Identifier } from "./assets/key.sql-B-kRFiGf.js";
import { R as Resource } from "./assets/resource.cloudflare-Mzu_X_uv.js";
import { eq, sql, and } from "drizzle-orm";
import "stripe";
import "./assets/fn-DkMgaEh2.js";
import "zod";
import "./assets/user-CzX0rSuB.js";
import "./assets/user.sql-BlLepWby.js";
import "drizzle-orm/mysql-core";
import "@jsx-email/render";
import "./assets/aws-DbqHRm5C.js";
import "aws4fetch";
import "./assets/key-BYGv1-7M.js";
import "drizzle-orm/planetscale-serverless";
import "@planetscale/database";
import "node:async_hooks";
import "ulid";
import "cloudflare:workers";
async function POST(input) {
  const body = await Billing.stripe().webhooks.constructEventAsync(await input.request.text(), input.request.headers.get("stripe-signature"), Resource.STRIPE_WEBHOOK_SECRET.value);
  console.log(body.type, JSON.stringify(body, null, 2));
  return (async () => {
    if (body.type === "customer.updated") {
      const prevInvoiceSettings = body.data.previous_attributes?.invoice_settings ?? {};
      if (!("default_payment_method" in prevInvoiceSettings)) return "ignored";
      const customerID = body.data.object.id;
      const paymentMethodID = body.data.object.invoice_settings.default_payment_method;
      if (!customerID) throw new Error("Customer ID not found");
      if (!paymentMethodID) throw new Error("Payment method ID not found");
      const paymentMethod = await Billing.stripe().paymentMethods.retrieve(paymentMethodID);
      await Database.use(async (tx) => {
        await tx.update(BillingTable).set({
          paymentMethodID,
          paymentMethodLast4: paymentMethod.card?.last4 ?? null,
          paymentMethodType: paymentMethod.type
        }).where(eq(BillingTable.customerID, customerID));
      });
    }
    if (body.type === "checkout.session.completed") {
      const workspaceID = body.data.object.metadata?.workspaceID;
      const amountInCents = body.data.object.metadata?.amount && parseInt(body.data.object.metadata?.amount);
      const customerID = body.data.object.customer;
      const paymentID = body.data.object.payment_intent;
      const invoiceID = body.data.object.invoice;
      if (!workspaceID) throw new Error("Workspace ID not found");
      if (!customerID) throw new Error("Customer ID not found");
      if (!amountInCents) throw new Error("Amount not found");
      if (!paymentID) throw new Error("Payment ID not found");
      if (!invoiceID) throw new Error("Invoice ID not found");
      await Actor.provide("system", {
        workspaceID
      }, async () => {
        const customer = await Billing.get();
        if (customer?.customerID && customer.customerID !== customerID) throw new Error("Customer ID mismatch");
        if (!customer?.customerID) {
          await Billing.stripe().customers.update(customerID, {
            metadata: {
              workspaceID
            }
          });
        }
        const paymentIntent = await Billing.stripe().paymentIntents.retrieve(paymentID, {
          expand: ["payment_method"]
        });
        const paymentMethod = paymentIntent.payment_method;
        if (!paymentMethod || typeof paymentMethod === "string") throw new Error("Payment method not expanded");
        await Database.transaction(async (tx) => {
          await tx.update(BillingTable).set({
            balance: sql`${BillingTable.balance} + ${centsToMicroCents(amountInCents)}`,
            customerID,
            paymentMethodID: paymentMethod.id,
            paymentMethodLast4: paymentMethod.card?.last4 ?? null,
            paymentMethodType: paymentMethod.type,
            // enable reload if first time enabling billing
            ...customer?.customerID ? {} : {
              reload: true,
              reloadError: null,
              timeReloadError: null
            }
          }).where(eq(BillingTable.workspaceID, workspaceID));
          await tx.insert(PaymentTable).values({
            workspaceID,
            id: Identifier.create("payment"),
            amount: centsToMicroCents(amountInCents),
            paymentID,
            invoiceID,
            customerID
          });
        });
      });
    }
    if (body.type === "charge.refunded") {
      const customerID = body.data.object.customer;
      const paymentIntentID = body.data.object.payment_intent;
      if (!customerID) throw new Error("Customer ID not found");
      if (!paymentIntentID) throw new Error("Payment ID not found");
      const workspaceID = await Database.use((tx) => tx.select({
        workspaceID: BillingTable.workspaceID
      }).from(BillingTable).where(eq(BillingTable.customerID, customerID)).then((rows) => rows[0]?.workspaceID));
      if (!workspaceID) throw new Error("Workspace ID not found");
      const amount = await Database.use((tx) => tx.select({
        amount: PaymentTable.amount
      }).from(PaymentTable).where(and(eq(PaymentTable.paymentID, paymentIntentID), eq(PaymentTable.workspaceID, workspaceID))).then((rows) => rows[0]?.amount));
      if (!amount) throw new Error("Payment not found");
      await Database.transaction(async (tx) => {
        await tx.update(PaymentTable).set({
          timeRefunded: new Date(body.created * 1e3)
        }).where(and(eq(PaymentTable.paymentID, paymentIntentID), eq(PaymentTable.workspaceID, workspaceID)));
        await tx.update(BillingTable).set({
          balance: sql`${BillingTable.balance} - ${amount}`
        }).where(eq(BillingTable.workspaceID, workspaceID));
      });
    }
  })().then((message) => {
    return Response.json({
      message: message ?? "done"
    }, {
      status: 200
    });
  }).catch((error) => {
    return Response.json({
      message: error.message
    }, {
      status: 500
    });
  });
}
export {
  POST
};
