import type { CultsModel } from "./cults.functions";

export const CATEGORIES = [
  "All",
  "Dragons",
  "Vehicles",
  "Architecture",
  "Engineering",
  "Miniatures",
  "Characters",
  "Sci-Fi",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

const RULES: Array<{ category: Exclude<Category, "All" | "Other">; patterns: RegExp }> = [
  { category: "Dragons", patterns: /dragon|wyvern|drake|wyrm|hydra|serpent/i },
  { category: "Vehicles", patterns: /\b(car|truck|vehicle|tank|bike|motorcycle|plane|aircraft|jet|ship|boat|drone|train)\b/i },
  { category: "Architecture", patterns: /architect|building|house|tower|castle|temple|bridge|interior|exterior|structure/i },
  { category: "Engineering", patterns: /cad|engineer|mechanical|gear|machine|part|assembly|industrial|tool|component|bracket/i },
  { category: "Miniatures", patterns: /miniature|mini\b|tabletop|rpg|dnd|d&d|warhammer|figurine|bust/i },
  { category: "Characters", patterns: /character|hero|warrior|knight|wizard|elf|orc|human|portrait|figure/i },
  { category: "Sci-Fi", patterns: /sci[- ]?fi|scifi|cyber|robot|mech\b|spaceship|space ship|alien|futuristic|cyberpunk/i },
];

export function categorize(
  model: Pick<CultsModel, "name" | "description"> & { tags?: string[] },
): Exclude<Category, "All"> {
  const tagText = model.tags?.join(" ") ?? "";
  const haystack = `${model.name} ${model.description} ${tagText}`;
  for (const { category, patterns } of RULES) {
    if (patterns.test(haystack)) return category;
  }
  return "Other";
}
