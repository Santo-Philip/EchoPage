import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import { SlashCommand } from "@/lib/slashCommand";
import { CaretPosition } from "@/lib/caretCoordination";
import { SlashMenu } from "./SlashMenu";
import { BubbleMenu } from '@tiptap/react/menus'



const EditorPage: React.FC = () => {
  const [show,setShow] = useState(false)
  const [coords, setCoords] = useState({ top: 0, bottom: 0, left: 0, right: 0 })
  const [slashRange, setSlashRange] = useState({ from: 0, to: 0 })

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
          heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: "Press '/' to open command menu, start typing here",
      }),
    SlashCommand.configure({
      setShow: (visible: boolean | ((prevState: boolean) => boolean), range: number) => {
        setShow(visible);
      },
      setRange: (range: React.SetStateAction<{ from: number; to: number; }>) => {
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
       <SlashMenu show={show} coords={coords} editor={editor} range={slashRange} />
       <BubbleMenu className=" bg-accent-primary border border-text-muted shadow-2xl rounded-2xl" editor={editor}>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${editor.isActive('bold')  ? 'bg-bg-primary' : ''} p-2 rounded-xl`}
          >
            Bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${editor.isActive('italic')  ? 'bg-bg-primary' : ''} p-2 rounded-xl`}
          >
            Italic
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
             className={`${editor.isActive('strike')  ? 'bg-bg-primary' : ''} p-2 rounded-xl`}
          >
            Strike
          </button>
        </BubbleMenu>
    </div>
  );
};

export default EditorPage;
