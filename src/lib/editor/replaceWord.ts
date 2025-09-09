import type { Editor } from "@tiptap/core";

export function replaceCurrentWord(editor: Editor, newWord: string) {
  const pos = editor.state.selection.from; 
  const docText = editor.state.doc.textBetween(0, pos, "\n", "\n");

  
  const match = docText.match(/(?:^|\s)(\S+)$/);
  if (!match) return;

  const lastWord = match[1];
  const start = pos - lastWord.length; 
  const end = pos; 

  editor
    .chain()
    .focus()
    .insertContentAt({ from: start, to: end }, newWord)
    .run();
}
