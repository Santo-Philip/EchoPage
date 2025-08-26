import { Editor } from "@tiptap/core";
import { getSearchParam } from "@/lib/blogs/getParams";
import autoSave from "@/lib/blogs/autosave";
import extractTitleAndDescription from "@/lib/blogs/titleDescExtract";

export function handleAutoSave(editor: Editor) {
  const saveContent = async () => {
    const id = getSearchParam("id");
    const json = editor.getJSON();
    const html = editor.getHTML();
    const { title, description } = extractTitleAndDescription(json);
    autoSave(id, {
      content_json: JSON.stringify(json),
      content_html: html,
      title,
      desc: description,
    });
  };

  editor.on("update", saveContent);

  return () => {
    editor.off("update", saveContent);
  };
}
