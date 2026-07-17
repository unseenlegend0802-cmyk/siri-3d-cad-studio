import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fetchCultsModelBySlug } from "../cults-public";

export default defineTool({
  name: "get_model",
  title: "Get model details",
  description:
    "Fetch full details for a single Siri3DCAD model by its Cults3D slug, including gallery images, tags, price, and purchase URL.",
  inputSchema: {
    slug: z
      .string()
      .trim()
      .min(1)
      .max(255)
      .describe("The Cults3D slug of the model (from list_models)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ slug }) => {
    const { model, error } = await fetchCultsModelBySlug(slug);
    if (error || !model) {
      return {
        content: [{ type: "text", text: `Model not found: ${error ?? "unknown"}` }],
        isError: true,
      };
    }
    const text = [
      `${model.name} — ${model.priceFormatted || "Free"}`,
      `Purchase: ${model.url}`,
      `Tags: ${model.tags.join(", ") || "none"}`,
      "",
      model.description,
    ].join("\n");
    return {
      content: [{ type: "text", text }],
      structuredContent: { model },
    };
  },
});
