import type { Alignment, Block } from "./blockTypes";


export interface AlignmentStyle {
  textAlign?: Alignment;
}

export const getAlignmentStyle = (block: Block): AlignmentStyle => ({
  textAlign: block.alignment || "left",
});