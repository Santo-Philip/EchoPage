import { useRef, useState, useEffect, useMemo, type KeyboardEvent, type ClipboardEvent } from "react";
import type { Block } from "../lib/blockTypes";
import { getAlignmentStyle } from "../lib/getAlignmentElement";
import { getTag } from "../lib/getTag";
import { GripVertical } from "lucide-react";
import { commands, type Command } from "../lib/commands";
import { CommandMenu } from "./commandMenu";

function EditorTab() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmd, setCmd] = useState("");
  const [cmdPos, setCmdPos] = useState<{ x: number; y: number } | null>(null);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = useMemo(
    () =>
      commands.filter((cmds) => cmds.name.toLowerCase().includes(cmd.toLowerCase())),
    [cmd]
  );

  const [blocks, setBlocks] = useState<Block[]>([
    { id: "1", type: "paragraph", content: "" },
  ]);

  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    Object.entries(refs.current).forEach(([id, el]) => {
      if (el && !el.innerText) {
        const block = blocks.find((b) => b.id === id);
        if (block) {
          el.innerText = typeof block.content === "string" ? block.content : block.content.url || "";
        }
      }
    });
  }, [blocks]);

  const getCursorPosition = (): { x: number; y: number } => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      return { x: rect.left, y: rect.bottom + 10 }; 
    }
    return { x: 0, y: 0 };
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, id: string) => {
    const el = refs.current[id];
    if (!el) return;

    if (e.key === "/" && !cmdOpen) {
      e.preventDefault(); 
      setCmdOpen(true);
      setCmd("");
      setCmdPos(getCursorPosition());
      setActiveBlock(id);
      setSelectedIndex(0);
      return;
    }

    if (cmdOpen && activeBlock === id) {
      if (e.key === "Enter") {
        e.preventDefault();
        const filteredCommands = commands.filter((cmds) =>
          cmds.name.toLowerCase().includes(cmd.toLowerCase())
        );
        if (filteredCommands[selectedIndex]) {
          handleCommandSelect(filteredCommands[selectedIndex]);
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        closeCommandMenu();
        return;
      }
    }

    
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const newBlock: Block = {
        id: `${Date.now()}-${Math.random()}`, 
        type: "paragraph",
        content: "",
      };
      setBlocks((prev) => [
        ...prev.slice(0, prev.findIndex((b) => b.id === id) + 1),
        newBlock,
        ...prev.slice(prev.findIndex((b) => b.id === id) + 1),
      ]);
      setTimeout(() => {
        refs.current[newBlock.id]?.focus();
      }, 0);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");

    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));

    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);

    handleInput(id);
  };

  const handleInput = (id: string) => {
    const el = refs.current[id];
    if (!el) return;

    const text = el.innerText;
    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id !== id) return block;

        if (cmdOpen && activeBlock === id) {
          
          const selection = window.getSelection();
          if (selection && selection.anchorNode) {
            const textBeforeCursor =
              (selection.anchorNode as Text).data?.slice(0, selection.anchorOffset) || text;
            const lastSlashIndex = textBeforeCursor.lastIndexOf("/");
            if (lastSlashIndex !== -1) {
              const query = textBeforeCursor.slice(lastSlashIndex + 1);
              setCmd(query);
              setCmdPos(getCursorPosition());
            } else {
              closeCommandMenu();
            }
          }
        }

        return { ...block, content: text };
      })
    );
  };

  const handleCommandSelect = (command: Command) => {
    if (!activeBlock) return;

    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id !== activeBlock) return block;

        const el = refs.current[activeBlock];
        let newContent: string | { url: string } = block.content;
        if (el) {
          const text = el.innerText;
          const lastSlashIndex = text.lastIndexOf(`/${cmd}`);
          newContent = lastSlashIndex !== -1 ? text.slice(0, lastSlashIndex) : text;
          el.innerText = typeof newContent === "string" ? newContent : "";
        }

        
        if (["image", "video", "embed"].includes(command.type)) {
          newContent = { url: "" }; 
        }

        return { ...block, type: command.type, content: newContent };
      })
    );

    closeCommandMenu();
  };

  const closeCommandMenu = () => {
    setCmdOpen(false);
    setCmd("");
    setCmdPos(null);
    setActiveBlock(null);
    setSelectedIndex(0);
  };

  return (
    <div
      id="editor"
      className="min-h-screen outline-none border border-text-muted rounded-xl p-4"
    >
      {blocks.map((block) => {
        const Tag = getTag(block);

        
        if (["image", "video", "embed"].includes(block.type)) {
          return (
            <div key={block.id} className="relative group">
              <GripVertical
                className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
                size={20}
              />
              <Tag
                ref={(el: HTMLDivElement | null) => (refs.current[block.id] = el)}
                src={typeof block.content === "string" ? block.content : block.content.url}
                className="outline-none border-none rounded-xl"
                style={getAlignmentStyle(block)}
              />
            </div>
          );
        }

        return (
          <div key={block.id} className="relative group">
            <GripVertical
              className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
              size={20}
            />
            <Tag
              ref={(el: HTMLDivElement | null) => (refs.current[block.id] = el)}
              className="outline-none border-none focus:bg-text-primary/30 rounded-xl p-2"
              contentEditable
              suppressContentEditableWarning
              style={getAlignmentStyle(block)}
              onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => handleKeyDown(e, block.id)}
              onInput={() => handleInput(block.id)}
              onPaste={(e: ClipboardEvent<HTMLDivElement>) => handlePaste(e, block.id)}
            />
          </div>
        );
      })}
      {cmdOpen && cmdPos && (
        <CommandMenu
          query={cmd}
          position={cmdPos}
          selectedIndex={selectedIndex}
          onSelect={handleCommandSelect}
          onClose={closeCommandMenu}
        />
      )}
    </div>
  );
}

export default EditorTab;