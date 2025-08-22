import uploadFileToApi from "@/lib/blogs/uploadFile";
import { compressImage } from "@/lib/compress";
import type { Editor } from "@tiptap/core";
import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react/menus";
import { useState } from "react";

interface BubbleMenuProps {
  editor: Editor;
}

export function BubbleMenu({ editor }: BubbleMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <TiptapBubbleMenu
      className="bg-bg-secondary flex overflow-x-hidden border border-text-muted shadow-md rounded-md p-1"
      editor={editor}
    >
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex gap-1 items-center px-2 py-1 bg-bg-primary rounded-md hover:bg-bg-secondary/30 text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          Menu
        </button>
        {showMenu && (
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
        )}
      </div>
    </TiptapBubbleMenu>
  );
}
