import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import { SlashCommand } from "@/lib/slashCommand";
import { CaretPosition } from "@/lib/caretCoordination";


const EditorPage: React.FC = () => {
  const [show,setShow] = useState(false)
  const [coords, setCoords] = useState({ top: 0, bottom: 0, left: 0, right: 0 })
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Press '/' to open command menu, start typing here",
      }),
      SlashCommand.configure({
        setShow,
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
      <div>{coords.left}</div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default EditorPage;
