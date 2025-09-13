function collectImageUrls(node: any): string[] {
  if (!node || typeof node !== "object") return [];

  let urls: string[] = [];

  if (node.type === "image" && node.attrs?.src) {
    urls.push(node.attrs.src);
  }

  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      urls.push(...collectImageUrls(child));
    }
  }

  return urls;
}
export { collectImageUrls };