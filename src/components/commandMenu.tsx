import {
  Type as ParagraphIcon,
  Heading1,
  Heading2,
  Quote,
  List,
  ListOrdered,
  Image,
  Video,
  Globe
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import type { BlockType } from "../lib/blockTypes";

interface BlockMenuItem {
  type: BlockType;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

export const blockMenu: BlockMenuItem[] = [
  { type: "paragraph", label: "Paragraph", icon: <ParagraphIcon />, description: "Normal text" },
  { type: "heading1", label: "Heading 1", icon: <Heading1 />, description: "Large section title" },
  { type: "heading2", label: "Heading 2", icon: <Heading2 />, description: "Medium section title" },
  { type: "quote", label: "Quote", icon: <Quote />, description: "Highlight important text" },
  { type: "bulleted-list", label: "Bulleted List", icon: <List />, description: "List with bullets" },
  { type: "numbered-list", label: "Numbered List", icon: <ListOrdered />, description: "List with numbers" },
  { type: "image", label: "Image", icon: <Image />, description: "Add an image" },
  { type: "video", label: "Video", icon: <Video />, description: "Embed a video" },
  { type: "embed", label: "Embed", icon: <Globe />, description: "Embed external content" },
];

interface CommandMenuProps {
  open: boolean;
  command: string;
  onSelect: (type: BlockType) => void;
  position : {
    x: number;
    y: number;
  }
}

export default function CommandMenu({ open, command, onSelect, position }: CommandMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [selectedIndex, setSelectedIndex] = useState(0);



  
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % filteredMenu.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + filteredMenu.length) % filteredMenu.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        onSelect(filteredMenu[selectedIndex].type);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSelectedIndex(0);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, selectedIndex]);

  
  const filteredMenu = command
    ? blockMenu.filter((item) =>
        item.label.toLowerCase().includes(command.toLowerCase())
      )
    : blockMenu;

  if (!open) return null;

  return (
    <div
      ref={menuRef}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        position: "fixed",
        zIndex: 999,
        minWidth: "240px"
      }}
      className="max-h-72 overflow-y-auto bg-bg-secondary rounded-xl border border-text-muted shadow-lg transform transition-all duration-150 ease-out"
    >
      <ul className="py-1">
        {filteredMenu.map((item, idx) => (
          <li
            key={item.type}
            onClick={() => onSelect(item.type)}
            className={`flex items-center gap-3 px-4 py-2 cursor-pointer rounded-lg transition-colors
              ${idx === selectedIndex ? "bg-text-primary/20" : "hover:bg-text-primary/10"}`}
          >
            {item.icon}
            <div className="flex flex-col">
              <span className="font-medium">{item.label}</span>
              {item.description && (
                <span className="text-xs text-text-muted">{item.description}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
