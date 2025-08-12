import type { Block } from "./blockTypes";


export type TagComponent = React.ElementType;

export const getTag = (block: Block): TagComponent => {
  switch (block.type) {
    case "heading1":
      return "h1";
    case "heading2":
      return "h2";
    case "heading3":
      return "h3";
    case "todo":
      return "div"; 
    case "code":
      return "pre";
    case "quote":
      return "blockquote";
    case "list":
      return "ul";
    case "table":
      return "table";
    case "image":
      return "img";
    case "video":
      return "video";
    case "embed":
      return "iframe";
    case "link":
      return "a";
    case "paragraph":
    default:
      return "p";
  }
};