import uploadFileToApi from "@/lib/blogs/uploadFile";
import { compressImage } from "@/lib/compress";
import type { Editor } from "@tiptap/core";
import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react/menus";
import { useEffect, useState } from "react";

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
      <button
        onClick={() => {
          console.log("Ask AI triggered");
        }}
        className="flex gap-1 items-center px-2 py-1 bg-bg-primary rounded-md hover:bg-bg-secondary/30 text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          fill="none"
          viewBox="0 0 16 16"
        >
          <path stroke="currentColor" d="M8 1.5H3.5a1 1 0 0 0-1 1v11" />
          <path stroke="currentColor" d="M14 14.5H3.5a1 1 0 1 1 0-2h10V8" />
          <path
            fill="currentColor"
            d="m11.5.5.99 2.51L15 4l-2.51.99-.99 2.51-.99-2.51L8 4l2.51-.99L11.5.5ZM7.5 5l.707 1.793L10 7.5l-1.793.707L7.5 10l-.707-1.793L5 7.5l1.793-.707L7.5 5Z"
          />
        </svg>
        Ask AI
      </button>
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
              onClick={() =>
                editor.chain().focus().setHeading({ level: 1 }).run
              }
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("heading1") ? "bg-yellow-100 " : ""
              }`}
            >
              Heading 1
            </li>
            <li
              onClick={() =>
                editor.chain().focus().setHeading({ level: 2 }).run
              }
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("heading2") ? "bg-yellow-100 " : ""
              }`}
            >
              Heading 2
            </li>
            <li
              onClick={() => {
                const link = window.prompt("Enter a URL:");
                if (link) {
                  editor.chain().focus().setImage({ src: link }).run();
                }
              }}
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("heading2") ? "bg-yellow-100 " : ""
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
                editor.isActive("heading2") ? "bg-yellow-100 " : ""
              }`}
            >
              Image
            </li>
            <li
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("bold") ? "font-bold bg-gray-50" : ""
              }`}
            >
              Bold
            </li>
            <li
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("italic") ? "italic bg-gray-50" : ""
              }`}
            >
              Italic
            </li>
            <li
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("underline") ? "underline bg-gray-50" : ""
              }`}
            >
              Underline
            </li>
            <li
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("strike") ? "line-through bg-gray-50" : ""
              }`}
            >
              Strikethrough
            </li>
            <li
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={`px-3 py-1.5 text-sm hover:bg-bg-secondary/30 cursor-pointer ${
                editor.isActive("superscript")
                  ? "text-xs align-super bg-gray-50"
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
              Task List
            </li>
          </ul>
        )}
      </div>
    </TiptapBubbleMenu>
  );
}
