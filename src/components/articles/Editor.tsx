import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "./BubbleMenu";
import { getEditorConfig } from "@/lib/blogs/editorSetup";
import {
  watchImageDeletion,
  deleteFileFromApi,
} from "@/lib/blogs/imageWatcher";
import { handleAutoSave } from "@/lib/blogs/saverhandler";
import { trackWordCount } from "@/lib/blogs/wordCount";
import { getSearchParam } from "@/lib/blogs/getParams";
import extractTitleAndDescription from "@/lib/blogs/titleDescExtract";
import slugify from "@/lib/blogs/slug";
import autoSave from "@/lib/blogs/autosave";

interface EditorPageProps {
  savedContent?: any;
}

export default function EditorPage({ savedContent }: EditorPageProps) {
  const [wordCount, setWordCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const editor = useEditor({
    ...getEditorConfig(),
    content: savedContent || null,
  });

  useEffect(() => {
    if (!editor) return;

    const cleanupImageDeletion = watchImageDeletion(
      editor,
      deleteFileFromApi,
      setError
    );
    const cleanupWordCount = trackWordCount(editor, setWordCount);
    const cleanupAutoSave = handleAutoSave(editor);

    return () => {
      cleanupImageDeletion();
      cleanupWordCount();
      cleanupAutoSave();
      editor.destroy();
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="editor-page mx-auto max-w-screen-md ">
      <div className="border border-text-muted rounded-lg shadow-sm">
        <EditorContent editor={editor} />
      </div>
      <div className="flex justify-between items-center mt-4">
        <p className="px-2 font-semibold text-text-muted">
          Total Words: {wordCount}
        </p>

        <button
          type="button"
          id="smtbtn"
          disabled={submitting}
          onClick={async () => {
            setSubmitting(true);

            const { title } = extractTitleAndDescription(editor.getJSON());
            const slug = await slugify(title);

            autoSave(getSearchParam("id"), { slug });
            await new Promise((resolve) => setTimeout(resolve, 2500));

            window.location.href = `/draft/manage?id=${getSearchParam("id")}`;
          }}
          className="flex items-center gap-2 bg-accent-primary hover:bg-accent-hover text-text-primary cursor-pointer px-6 py-2 rounded-xl transition"
        >
          {submitting ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-spin"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <span>Submit</span>
          )}
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2 animate-pulse">{error}</p>
      )}
      <BubbleMenu editor={editor} />
    </div>
  );
}
