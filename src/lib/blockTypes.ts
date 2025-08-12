export type Mark = "bold" | "italic" | "underline" | "strikethrough";

export type BlockType =
  | "paragraph"
  | "heading1"
  | "heading2"
  | "heading3"
  | "todo"
  | "code"
  | "quote"
  | "image"
  | "link"
  | "list"
  | "table"
  | "video"
  | "embed";

export type Alignment = "left" | "center" | "right" | "justify";

export type Block = {
  id: string;
  type: BlockType;
  content: string | { url: string; [key: string]: any }; 
  marks?: Mark[]; 
  alignment?: Alignment; 
  
  alt?: string; 
  caption?: string; 
  language?: string; 
  checked?: boolean; 
};