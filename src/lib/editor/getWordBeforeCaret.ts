import type { Editor } from "@tiptap/core";

function getWordBeforeCaret(editor: Editor): string | null {
  const { state } = editor;
  const { from } = state.selection;

  
  const textBefore = state.doc.textBetween(Math.max(0, from - 50), from, "\n", "\n");
  const match = textBefore.match(/(\S+)$/); 
  return match ? match[1] : null;
}
export default getWordBeforeCaret;