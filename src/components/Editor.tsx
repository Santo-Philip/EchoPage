import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { SlashMenu } from './SlashMenu';
import { BubbleMenu } from './BubbleMenu';
import { getEditorConfig } from '@/lib/blogs/editorSetup';
import { watchImageDeletion, deleteFileFromApi } from '@/lib/blogs/imageWatcher';
import { handleAutoSave } from '@/lib/blogs/saverhandler';
import { trackWordCount } from '@/lib/blogs/wordCount';

interface EditorPageProps {
  savedContent?: any;
}

export default function EditorPage({ savedContent }: EditorPageProps) {
  const [show, setShow] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  const [slashRange, setSlashRange] = useState({ from: 0, to: 0 });

  const editor = useEditor({
    ...getEditorConfig({ setShow, setRange: setSlashRange, setCoords }),
    content: savedContent || null,
  });

  useEffect(() => {
    if (editor) {
      const cleanupImageDeletion = watchImageDeletion(editor, deleteFileFromApi, setError);
      const cleanupWordCount = trackWordCount(editor, setWordCount);
      const cleanupAutoSave = handleAutoSave(editor);

      return () => {
        cleanupImageDeletion();
        cleanupWordCount();
        cleanupAutoSave();
        editor.destroy();
      };
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="editor-page mx-auto">
      <EditorContent editor={editor} />
      <p className="p-2 font-bold text-text-muted">Total Words: {wordCount}</p>
      {error && (
        <p className="text-red-500 text-sm mt-2 animate-pulse">{error}</p>
      )}
      <SlashMenu show={show} coords={coords} editor={editor} range={slashRange} />
      <BubbleMenu editor={editor} />
    </div>
  );
}