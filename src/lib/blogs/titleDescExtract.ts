interface BlogMeta {
  title: string;
  description: string;
}

function extractTitleAndDescription(tiptapJson: any): BlogMeta {
  let title = "";
  let description = "";

  if (!tiptapJson || !Array.isArray(tiptapJson.content)) {
    return { title, description };
  }

  for (const node of tiptapJson.content) {
    if (node.type === "heading" && node.content?.length) {
      title = node.content.map((n: any) => n.text).join(" ");

      if (title.length > 60) title = title.slice(0, 57) + "...";
      break;
    }
  }

  let descBuilder = "";
  for (const node of tiptapJson.content) {
    if (node.type === "paragraph" && node.content?.length) {
      const paragraphText = node.content.map((n: any) => n.text).join(" ");
      descBuilder += (descBuilder ? " " : "") + paragraphText;
      if (descBuilder.length >= 160) break;
    }
  }

  description = descBuilder.trim();

  if (description.length > 160) {
    description = description.slice(0, 157) + "...";
  }

  return { title, description };
}

export default extractTitleAndDescription;
