// CommandMenu.tsx
import { commands, type Command } from "../lib/commands";

interface CommandMenuProps {
  query: string;
  position: { x: number; y: number };
  selectedIndex: number;
  onSelect: (command: Command) => void;
  onClose: () => void;
}

export function CommandMenu({
  query,
  position,
  selectedIndex,
  onSelect,
  onClose,
}: CommandMenuProps) {
  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(query.toLowerCase())
  );

  if (filteredCommands.length === 0) {
    onClose();
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        zIndex: 1000,
        maxHeight: "240px",
        overflowY: "auto",
        minWidth: "200px",
      }}
    >
      <ul style={{ listStyle: "none", margin: 0, padding: "4px 0" }}>
        {filteredCommands.map((cmd, index) => (
          <li
            key={cmd.type}
            onClick={() => onSelect(cmd)}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              background: index === selectedIndex ? "#f3f4f6" : "transparent",
              fontSize: "14px",
              transition: "background 0.1s",
            }}
          >
            {cmd.name}
          </li>
        ))}
      </ul>
    </div>
  );
}