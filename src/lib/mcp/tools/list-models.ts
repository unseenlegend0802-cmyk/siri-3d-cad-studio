import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fetchCultsModels } from "../cults-public";

export default defineTool({
  name: "list_models",
  title: "List Siri3DCAD models",
  description:
    "List public 3D models published by Siri3DCAD Studio on Cults3D. Returns name, slug, description, price, tags, thumbnail, and the Cults3D URL for purchase.",
  inputSchema: {
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(25)
      .describe("Maximum number of models to return (1-100)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ limit }) => {
    const { models, error } = await fetchCultsModels(limit);
    if (error) {
      return {
        content: [{ type: "text", text: `Unable to load models: ${error}` }],
        isError: true,
      };
    }
    const summary = models
      .map(
        (m) =>
          `- ${m.name} (${m.priceFormatted || "Free"}) — ${m.url}\n  slug: ${m.slug}\n  ${m.description.slice(0, 160)}`,
      )
      .join("\n");
    return {
      content: [
        { type: "text", text: summary || "No models published yet." },
      ],
      structuredContent: { models },
    };
  },
});
