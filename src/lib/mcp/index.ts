import { defineMcp } from "@lovable.dev/mcp-js";
import listModelsTool from "./tools/list-models";
import getModelTool from "./tools/get-model";

export default defineMcp({
  name: "siri3dcad-mcp",
  title: "Siri3DCAD Studio",
  version: "0.1.0",
  instructions:
    "Public catalog access for Siri3DCAD Studio. Use `list_models` to browse the studio's 3D models on Cults3D, and `get_model` to fetch full details (description, gallery, price, purchase URL) for a specific slug. All data is public — no authentication required.",
  tools: [listModelsTool, getModelTool],
});
