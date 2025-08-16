import React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import type { Editor } from "@tiptap/core";

interface SlashMenuProps {
  show: boolean;
  coords: { left: number; bottom: number };
  editor: Editor | null;
  range: { from: number; to: number };
}

export const SlashMenu: React.FC<SlashMenuProps> = ({
  show,
  coords,
  editor,
  range,
}) => {
  if (!show) return null;
  const items = [
    {
      title: "Heading 1",
      onSelect: () => {
        editor?.chain().focus().setHeading({ level: 1 }).run();
      },
    },
    {
      title: "Bold",
      onSelect: () => {
        editor?.chain().focus().toggleBold().run();
      },
    },
  ];
  const handleClick = () => {
    editor?.chain().deleteRange(range).focus().run();
  };
  return (
    <Tippy
      visible={show}
      interactive
      placement="bottom-start"
      appendTo={document.body}
      getReferenceClientRect={() =>
        new DOMRect(coords.left, coords.bottom, 0, 0)
      }
      render={() => (
        <div className="bg-white border border-gray-300 rounded shadow-lg w-48 max-h-64 overflow-y-auto z-50">
          {items.map((item, i) => (
            <button
              key={i}
              onMouseDown={(e) => e.preventDefault()} 
              onClick={() => {
                editor?.chain().deleteRange(range).focus().run();
                item.onSelect();
              }}
              className="w-full text-left px-2 py-1 hover:bg-gray-100 cursor-pointer"
            >
              {item.title}
            </button>
          ))}
        </div>
      )}
    />
  );
};
