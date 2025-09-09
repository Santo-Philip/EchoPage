import aiClient from "@/lib/aiClient";
import uploadFileToApi from "@/lib/blogs/uploadFile";
import { compressImage } from "@/lib/compress";
import type { Editor } from "@tiptap/core";
import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react/menus";

interface BubbleMenuProps {
  editor: Editor;
}

interface TipTapJSONNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapJSONNode[];
  text?: string;
}

export function BubbleMenu({ editor }: BubbleMenuProps) {
  return (
    <TiptapBubbleMenu
      className="bg-bg-secondary flex overflow-x-hidden border border-text-muted shadow-md rounded-md p-1"
      editor={editor}
    >
      <div className="relative">
          <ul className=" top-full left-0 mt-1 w-40 h-60 overflow-y-auto bg-bg-primary border border-text-muted text-text-primary shadow-md rounded-md py-1 z-10">
            <li
              onClick={() => {
                editor?.chain().focus().setHeading({ level: 1 }).run();
              }}
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("heading1") ? "text-text-muted " : ""
              }`}
            >
              Heading 1
            </li>
            <li
              onClick={() => {
                editor?.chain().focus().setHeading({ level: 2 }).run();
              }}
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("heading2") ? "text-text-muted " : ""
              }`}
            >
              Heading 2
            </li>
                        <li
            className="px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer "
              onClick={async () => {
                window.showLoading(true);
                const { from, to } = editor.state.selection;
                const selectedText = editor.state.doc.textBetween(
                  from,
                  to,
                  " "
                );

                if (!selectedText) {
                  window.showToast("No text selected!");
                  window.showLoading(false);
                  return;
                }

                try {
                  const trnslt = await aiClient({
                    system:
                      "You are a writing assistant for TipTap editor. Just return valid TipTap JSON, no explanations.Include minimum 100 words",
                    prompt: `continue wrinting after this also include the following text: ${selectedText}`,
                  });

                  let parsed;
                  try {
                    parsed = JSON.parse(trnslt);
                  } catch (err) {
                    window.showToast(
                      "Error: AI returned invalid JSON. Try again."
                    );
                    return;
                  }
                  if (
                    parsed &&
                    "content" in parsed &&
                    Array.isArray(parsed.content)
                  ) {
                    editor.commands.insertContent(parsed.content);
                  } else {
                    editor.commands.insertContent(parsed);
                  }
                } catch (err) {
                  console.error(err);
                  window.showToast("Unexpected error while translating.");
                } finally {
                  window.showLoading(false);
                }
              }}
            >
              AI Continue
            </li>
            <li
            className="px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer "
              onClick={async () => {
                window.showLoading(true);

                const lang = window.prompt("Enter a language:");
                if (!lang) {
                  window.showLoading(false);
                  return;
                }
                const { from, to } = editor.state.selection;
                const selectedText = editor.state.doc.textBetween(
                  from,
                  to,
                  " "
                );

                if (!selectedText) {
                  window.showToast("No text selected!");
                  window.showLoading(false);
                  return;
                }

                try {
                  const trnslt = await aiClient({
                    system:
                      "You are the best language translator for TipTap. Just return valid TipTap JSON, no explanations.",
                    prompt: `Translate the following text into ${lang}: ${selectedText}`,
                  });

                  let parsed;
                  try {
                    parsed = JSON.parse(trnslt);
                  } catch (err) {
                    window.showToast(
                      "Error: AI returned invalid JSON. Try again."
                    );
                    return;
                  }
                  if (
                    parsed &&
                    "content" in parsed &&
                    Array.isArray(parsed.content)
                  ) {
                    editor.commands.insertContent(parsed.content);
                  } else {
                    editor.commands.insertContent(parsed);
                  }
                } catch (err) {
                  console.error(err);
                  window.showToast("Unexpected error while translating.");
                } finally {
                  window.showLoading(false);
                }
              }}
            >
              AI Translate
            </li>

            <li
              onClick={() => {
                editor?.chain().focus().setParagraph().run();
              }}
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("paragrpah") ? "text-text-muted " : ""
              }`}
            >
              Text
            </li>
            <li
              onClick={() => {
                editor?.chain().focus().toggleBlockquote().run();
              }}
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("paragrpah") ? "text-text-muted " : ""
              }`}
            >
              Quote
            </li>
            <li
              onClick={() => {
                const link = window.prompt("Enter a URL:");
                if (link) {
                  editor.chain().focus().setImage({ src: link }).run();
                }
              }}
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("heading2") ? "text-text-muted " : ""
              }`}
            >
              URL Image
            </li>
            <li
              onClick={async () => {
                const [fileHandle] = await (window as any).showOpenFilePicker({
                  types: [
                    {
                      description: "Images",
                      accept: {
                        "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
                      },
                    },
                  ],
                  multiple: false,
                });
                const file = await fileHandle.getFile();
                const compressedFile = await compressImage(file);
                const url = await uploadFileToApi(compressedFile);
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              }}
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("heading2") ? "text-text-muted " : ""
              }`}
            >
              Image
            </li>
            <li
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("bold") ? "font-bold bg-text-muted/50" : ""
              }`}
            >
              Bold
            </li>
            <li
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("italic") ? "italic bg-text-muted/50" : ""
              }`}
            >
              Italic
            </li>
            <li
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("underline") ? "underline bg-text-muted/50" : ""
              }`}
            >
              Underline
            </li>
            <li
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("strike") ? "line-through bg-text-muted/50" : ""
              }`}
            >
              Strikethrough
            </li>
            <li
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("superscript")
                  ? "text-xs align-super bg-text-muted/50"
                  : ""
              }`}
            >
              Superscript
            </li>
            <li
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("highlight") ? "text-text-muted/50" : ""
              }`}
            >
              Highlight
            </li>
            <li
              onClick={() => {
                const link = window.prompt("Enter a URL:");
                if (link) {
                  editor.chain().focus().setLink({ href: link }).run();
                }
              }}
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("link") ? "text-text-muted/50" : ""
              }`}
            >
              Link
            </li>
            <li
              onClick={() =>
                editor.chain().focus().toggleTextAlign("center").run()
              }
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("textalign") ? "text-text-muted/50" : ""
              }`}
            >
              Center
            </li>

            <li
              onClick={() =>
                editor.chain().focus().toggleTextAlign("left").run()
              }
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("textalign") ? "text-text-muted/50" : ""
              }`}
            >
              Left
            </li>

            <li
              onClick={() =>
                editor.chain().focus().toggleTextAlign("right").run()
              }
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("textalign") ? "text-text-muted/50" : ""
              }`}
            >
              Right
            </li>

            <li
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("list") ? "text-text-muted/50" : ""
              }`}
            >
              List
            </li>
          </ul>
      </div>
    </TiptapBubbleMenu>
  );
}
