import type { BlockType } from "./blockTypes"; 

export interface Command {
  name: string;
  type: BlockType;
  icon?: string; 
}

export const commands: Command[] = [
  { name: "Paragraph", type: "paragraph" },
  { name: "Heading 1", type: "heading1" },
  { name: "Heading 2", type: "heading2" },
  { name: "Heading 3", type: "heading3" },
  { name: "Todo", type: "todo" },
  { name: "Code", type: "code" },
  { name: "Quote", type: "quote" },
  { name: "Image", type: "image" },
  { name: "List", type: "list" },
  
];