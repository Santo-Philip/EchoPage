import { useRef, useState, useEffect } from "react";

function EditorTab() {
  const [blocks, setBlocks] = useState([
    { id: "1", type: "paragraph", content: "" },
  ]);

  const refs = useRef<{ [key: string]: HTMLElement | null }>({});

  const handlePaste = (e: React.ClipboardEvent, id: string) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text); 
    handleInput(id); 
  };

  const handleInput = (id: string) => {
    const el = refs.current[id];
    if (!el) return;
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? { ...block, content: el.innerText } : block
      )
    );
  };

  return (
    <div
      id="editor"
      className="min-h-screen outline-none border border-text-muted rounded-xl p-2"
    >
      {blocks.map((block) => {
        const Tag = block.type === "paragraph" ? "p" : "div";

        return (
          <Tag
          className="outline-none border-none"
            key={block.id}
            ref={(el) => {
              refs.current[block.id] = el;
              if (el && !el.innerText) {
                el.innerText = block.content; 
              }
            }}
            contentEditable
            suppressContentEditableWarning
            onInput={() => handleInput(block.id)}
            onPaste={(e) => handlePaste(e, block.id)}
          />
        );
      })}
    </div>
  );
}

export default EditorTab;
