import { Editor } from '@tiptap/core';

export function trackWordCount(
  editor: Editor,
  setWordCount: (count: number) => void
) {
  const updateWordCount = () => {
    const text = editor.getText();
    const count = text.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(count);
  };

  editor.on('update', updateWordCount);
  editor.on('focus', updateWordCount);

  return () => {
    editor.off('update', updateWordCount);
    editor.off('focus', updateWordCount);
  };
}