import type { JSONContent } from "@tiptap/core";

interface LastNodeInfo {
  type: string;
  text: string;
}

function getLastTextNode(
  node: JSONContent | null | undefined
): LastNodeInfo | null {
  if (!node) return null;

  if (node.type === "image" || node.type === "youtube") return null;

  if ("text" in node && node.text?.trim()) {
    return { type: `${node.type}`, text: node.text.trim() };
  }

  if ("content" in node && node.content?.length) {
    for (let i = node.content.length - 1; i >= 0; i--) {
      const child = node.content[i];
      const lastNode = getLastTextNode(child);
      if (lastNode) return lastNode;
    }
  }

  return null;
}

export default getLastTextNode;
