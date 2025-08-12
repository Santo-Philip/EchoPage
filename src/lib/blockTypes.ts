
export type BlockType =
  | "paragraph"
  | "heading1"
  | "heading2"
  | "quote"
  | "bulleted-list"
  | "numbered-list"
  | "image"
  | "video"
  | "embed";

export type Alignment = "left" | "center" | "right";


export interface BaseBlock {
  id: string;             
  type: BlockType;        
  align?: Alignment;    
  index?: number;  
}


export interface TextBlock extends BaseBlock {
  type:
    | "paragraph"
    | "heading1"
    | "heading2"
    | "quote"
    | "bulleted-list"
    | "numbered-list";
  content: string;        
}


export interface MediaBlock extends BaseBlock {
  type: "image" | "video" | "embed";
  content: {
    url: string;          
    caption?: string;     
  };
}


export type Block = TextBlock | MediaBlock;
