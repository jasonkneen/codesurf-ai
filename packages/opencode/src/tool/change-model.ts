import { Tool } from "./tool"
import z from "zod"
import { Config } from "../config/config"
import { Provider } from "../provider/provider"

export const ChangeModelTool = Tool.define("change_model", {
  description: "Change the default AI model for the current project configuration",
  parameters: z.object({
    model: z
      .string()
      .describe("The model ID in the format 'provider/model' (e.g. 'anthropic/claude-3-5-sonnet-20241022')"),
  }),
  async execute({ model }, ctx) {
    // Verify the model exists
    try {
      const [providerID, modelID] = model.split("/")
      if (!providerID || !modelID) {
        throw new Error("Model must be in format 'provider/model'")
      }
      await Provider.getModel(providerID, modelID)
    } catch (error) {
      throw new Error(`Invalid model '${model}': ${error instanceof Error ? error.message : String(error)}`)
    }

    // Update config
    await Config.update({
      model,
    })

    return {
      title: "Model Changed",
      metadata: {},
      output: `Successfully changed default model to ${model}. This change will apply to future sessions and turns.`,
    }
  },
})
