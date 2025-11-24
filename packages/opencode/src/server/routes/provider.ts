import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver } from "hono-openapi"
import z from "zod"
import { Provider } from "../../provider/provider"
import { ModelsDev } from "../../provider/models"
import { mapValues } from "remeda"
import { Log } from "../../util/log"

export function providerRoutes() {
  const log = Log.create({ service: "server" })
  const router = new Hono()

  router.get(
    "/providers",
    describeRoute({
      description: "List all providers",
      operationId: "config.providers",
      responses: {
        200: {
          description: "List of providers",
          content: {
            "application/json": {
              schema: resolver(
                z.object({
                  providers: ModelsDev.Provider.array(),
                  default: z.record(z.string(), z.string()),
                }),
              ),
            },
          },
        },
      },
    }),
    async (c) => {
      using _ = log.time("providers")
      const authenticatedProviders = await Provider.list().then((x) => mapValues(x, (item) => item.info))

      // Get all providers from models.dev database plus synthetic ones
      const database = await ModelsDev.get()

      // Add synthetic kilocode provider to database if not already there
      if (!database["kilocode"]) {
        database["kilocode"] = {
          id: "kilocode",
          name: "Kilocode",
          npm: "@ai-sdk/openai-compatible",
          env: ["KILOCODE_API_KEY"],
          api: "https://api.kilocode.ai/api/openrouter",
          models: {},
        }
      }

      // Merge authenticated and database providers, preferring authenticated ones
      const allProviders = { ...database, ...authenticatedProviders }

      return c.json({
        providers: Object.values(allProviders),
        default: mapValues(authenticatedProviders, (item) => Provider.sort(Object.values(item.models))[0].id),
      })
    },
  )

  return router
}
