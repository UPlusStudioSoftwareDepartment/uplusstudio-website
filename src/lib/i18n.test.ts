import { describe, expect, it } from "vitest";
import en from "../../messages/en";
import tr from "../../messages/tr";

type Tree = { [key: string]: unknown };
const leaves = (tree: Tree, prefix = ""): string[] =>
  Object.entries(tree).flatMap(([key, value]) => (value && typeof value === "object" && !Array.isArray(value) ? leaves(value as Tree, `${prefix}${key}.`) : [`${prefix}${key}`]));

describe("translations", () => {
  it("have the same message keys in Turkish and English", () => {
    const trKeys = new Set(leaves(tr as Tree));
    const enKeys = new Set(leaves(en as Tree));
    expect([...trKeys].filter((k) => !enKeys.has(k)), "missing in English").toEqual([]);
    expect([...enKeys].filter((k) => !trKeys.has(k)), "missing in Turkish").toEqual([]);
  });
});
