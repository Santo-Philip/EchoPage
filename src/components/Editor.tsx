import { useState, useRef } from "react";
import type { Block } from "../lib/blockTypes";
import CommandMenu from "./commandMenu";

function EditorTab() {
  const [openCommand, setOpenCommand] = useState(false);
  const [command, setCommand] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: crypto.randomUUID(),
      index: 1,
      type: "paragraph",
      content: "",
    },
  ]);

  const blockRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  let rafId: number | null = null;

  const newNode = (type: Block["type"]) => {
    setBlocks((prev) => {
      const newBlock =
        type === "image" || type === "video" || type === "embed"
          ? {
              id: crypto.randomUUID(),
              type,
              content: { url: "" },
              index: prev.length + 1,
            }
          : {
              id: crypto.randomUUID(),
              type,
              content: "",
              index: prev.length + 1,
            };

      setTimeout(() => {
        const ref = blockRefs.current.get(newBlock.id);
        if (ref) ref.focus();
      }, 0);

      return [...prev, newBlock];
    });
  };

  function getSmartMenuPosition(menuHeight = 288) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      return { x: 0, y: 0 };
    }

    const range = sel.getRangeAt(0).cloneRange();
    range.collapse(true);

    const caretRect =
      range.getClientRects().length > 0
        ? range.getClientRects()[0]
        : range.getBoundingClientRect();

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let posY: number;
    const spaceBelow = viewportHeight - caretRect.bottom;

    if (spaceBelow >= menuHeight) {
      posY = caretRect.bottom + 12;
    } else {
      posY = caretRect.top - menuHeight - 12;
      if (posY < 0) posY = 0;
    }

    let posX = caretRect.left;
    const menuWidth = 300;

    if (posX + menuWidth > viewportWidth) {
      posX = viewportWidth - menuWidth;
    }
    if (posX < 0) posX = 0;

    return { x: posX, y: posY };
  }

  const handleInput = (text: string, blockId: string) => {
    setBlocks((prev) => {
      const updated = prev.map((b) =>
        b.id === blockId && b.type === "paragraph" ? { ...b, content: text } : b
      );

      setPosition(getSmartMenuPosition());
      console.log("Position:", position);
      console.log("Updated blocks:", updated);
      return updated;
    });

    if (text.startsWith("/")) {
      setOpenCommand(true);
      document.documentElement.style.overflow = "hidden";
      setCommand(text.slice(1));
    } else {
      document.documentElement.style.overflow = "auto";
      setCommand("");
      setOpenCommand(false);
    }
  };

  const removeNode = (blockId: string, e: HTMLElement) => {
    const currentIndex = blocks.findIndex((b) => b.id === blockId);
    if (currentIndex > 0) {
      const currBlock = blocks[currentIndex];
      const prevBlock = blocks[currentIndex - 1];
      const prevLength =
        typeof prevBlock.content === "string"
          ? prevBlock.content.length
          : typeof prevBlock.content === "object" && prevBlock.content?.url
          ? prevBlock.content.url.length
          : 0;

      let mergedContent: any;
      if (
        (prevBlock.type === "image" ||
          prevBlock.type === "video" ||
          prevBlock.type === "embed") &&
        typeof prevBlock.content === "object"
      ) {
        const prevUrl = prevBlock.content.url || "";
        const currUrl =
          (currBlock.type === "image" ||
            currBlock.type === "video" ||
            currBlock.type === "embed") &&
          typeof currBlock.content === "object"
            ? currBlock.content.url
            : typeof currBlock.content === "string"
            ? currBlock.content
            : "";
        mergedContent = { ...prevBlock.content, url: prevUrl + currUrl };
      } else {
        mergedContent =
          (typeof prevBlock.content === "string" ? prevBlock.content : "") +
          (typeof currBlock.content === "string" ? currBlock.content : "");
      }

      const newBlocks = [...blocks];
      newBlocks[currentIndex - 1] = { ...prevBlock, content: mergedContent };
      newBlocks.splice(currentIndex, 1);
      setBlocks(newBlocks);
      e.blur();

      setTimeout(() => {
        const prevEl = blockRefs.current.get(prevBlock.id);
        if (prevEl) {
          prevEl.focus();
          const range = document.createRange();
          const node = prevEl.firstChild;
          if (node && node.nodeType === Node.TEXT_NODE) {
            range.setStart(
              node,
              Math.min(prevLength, node.textContent?.length ?? 0)
            );
          } else {
            range.selectNodeContents(prevEl);
            range.collapse(true);
          }
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }, 0);
    }
  };

  const handleKeyboard = (
    e: React.KeyboardEvent<HTMLDivElement>,
    blockId: string
  ) => {
    const selection = window.getSelection();
    const isAtStart = selection?.focusOffset === 0;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      newNode("paragraph");
    }
    if (e.key === "Backspace" && blocks.length > 1 && isAtStart) {
      e.preventDefault();
      removeNode(blockId, e.currentTarget);
    }
  };

  return (
    <div
      id="editor"
      className="rounded-2xl relative border border-text-muted min-h-screen"
    >
      <CommandMenu
        position={position}
        open={openCommand}
        command={command}
        onSelect={(type) => {
          newNode(type);
          setCommand("");
          setOpenCommand(false);
        }}
      />

      {blocks.map((block) => (
        <div key={block.id}>
          {block.type === "paragraph" && (
            <div
              className="outline-none focus:bg-text-muted/30 rounded-xl p-2"
              contentEditable
              ref={(el) => {
                if (el) {
                  blockRefs.current.set(block.id, el);
                  if (block.content && el.innerText !== block.content) {
                    el.innerText = block.content;
                  }
                } else {
                  blockRefs.current.delete(block.id);
                }
              }}
              suppressContentEditableWarning
              onInput={(e) =>
                handleInput((e.target as HTMLDivElement).innerText, block.id)
              }
              onKeyDown={(e) => handleKeyboard(e, block.id)}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
}

export default EditorTab;
