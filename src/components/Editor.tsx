import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import { SlashCommand } from "@/lib/slashCommand";
import { CaretPosition } from "@/lib/caretCoordination";
import { SlashMenu } from "./SlashMenu";
import { BubbleMenu } from "@tiptap/react/menus";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Highlight from "@tiptap/extension-highlight";
import autoSave from "@/lib/blogs/autosave";
import { getSearchParam } from "@/lib/blogs/getParams";

interface Props {
  savedContent?: any; 
}

const EditorPage: React.FC<Props> = ({ savedContent}) => {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  const [slashRange, setSlashRange] = useState({ from: 0, to: 0 });

  const editor = useEditor({
      onUpdate: ({ editor }) => {
    const id = getSearchParam('id')
    const json = editor.getJSON()
    const html = editor.getHTML()
    autoSave(id,{content_json:JSON.stringify(json),content_html:html})
  },
    autofocus: true,
    content: savedContent ? savedContent : '',
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Highlight.configure({ multicolor: true }),
      Superscript,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Youtube.configure({
        addPasteHandler: true,
        allowFullscreen: true,
        controls: true,
      }),
      Link.configure({
        linkOnPaste: true,
        autolink: true,
      }),

      Placeholder.configure({
        placeholder: "Press '/' to open command menu, start typing here",
      }),
      SlashCommand.configure({
        setShow: (
          visible: boolean | ((prevState: boolean) => boolean),
          range: number
        ) => {
          setShow(visible);
        },
        setRange: (
          range: React.SetStateAction<{ from: number; to: number }>
        ) => {
          setSlashRange(range);
        },
      }),
      CaretPosition.configure({
        setCoords,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none p-3 min-h-screen bg-white rounded-lg shadow-sm",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="editor-page  mx-auto">
      <EditorContent editor={editor} />
      <SlashMenu
        show={show}
        coords={coords}
        editor={editor}
        range={slashRange}
      />
      <BubbleMenu
        className=" bg-bg-secondary  flex flex-wrap overflow-x-hidden border border-text-muted shadow-2xl rounded-full p-[2px]"
        editor={editor}
      >
        <button>
          <div className="flex gap-2 justify-center items-center p-2 bg-bg-primary div-2 rounded-full shadow-2x border-accent border">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
            <p>Explain</p>
          </div>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${
            editor.isActive("bold") ? "bg-text-primary text-bg-primary" : ""
          } px-4 py-2 rounded-full `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-bold-icon lucide-bold"
          >
            <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`${
            editor.isActive("underline")
              ? "bg-text-primary text-bg-primary"
              : ""
          } px-4 py-2 rounded-full `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-underline-icon lucide-underline"
          >
            <path d="M6 4v6a6 6 0 0 0 12 0V4" />
            <line x1="4" x2="20" y1="20" y2="20" />
          </svg>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${
            editor.isActive("italic") ? "bg-text-primary text-bg-primary" : ""
          } px-4 py-2 rounded-full `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-italic-icon lucide-italic"
          >
            <line x1="19" x2="10" y1="4" y2="4" />
            <line x1="14" x2="5" y1="20" y2="20" />
            <line x1="15" x2="9" y1="4" y2="20" />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${
            editor.isActive("strike") ? "bg-text-primary text-bg-primary" : ""
          } px-4 py-2 rounded-full `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-strikethrough-icon lucide-strikethrough"
          >
            <path d="M16 4H9a3 3 0 0 0-2.83 4" />
            <path d="M14 12a4 4 0 0 1 0 8H6" />
            <line x1="4" x2="20" y1="12" y2="12" />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={`${
            editor.isActive("superscript")
              ? "bg-text-primary text-bg-primary"
              : ""
          } px-4 py-2 rounded-full `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-superscript-icon lucide-superscript"
          >
            <path d="m4 19 8-8" />
            <path d="m12 19-8-8" />
            <path d="M20 12h-4c0-1.5.442-2 1.5-2.5S20 8.334 20 7.002c0-.472-.17-.93-.484-1.29a2.105 2.105 0 0 0-2.617-.436c-.42.239-.738.614-.899 1.06" />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`${
            editor.isActive("superscript")
              ? "bg-text-primary text-bg-primary"
              : ""
          } px-4 py-2 rounded-full `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-highlighter-icon lucide-highlighter"
          >
            <path d="m9 11-6 6v3h9l3-3" />
            <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" />
          </svg>
        </button>
      </BubbleMenu>
    </div>
  );
};

export default EditorPage;
