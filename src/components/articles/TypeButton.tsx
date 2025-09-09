import { useEffect, useState } from "react";
import { getSearchParam } from "@/lib/blogs/getParams";
import getWordBeforeCaret from "@/lib/editor/getWordBeforeCaret";
import type { Editor } from "@tiptap/core";

interface TypeButtonProps {
  editor: Editor;
}

export default function TypeButton({ editor }: TypeButtonProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string | null>(null);

  useEffect(() => {
    if (!editor) return;

    const updateSuggestions = async () => {
      const word = getWordBeforeCaret(editor);
      setCurrentWord(word);

      if (!word) {
        setSuggestions([]);
        return;
      }

      const lang = getSearchParam("lang") || "en";
      const url = `https://inputtools.google.com/request?text=${word}&itc=${lang}-t-i0-und&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8`;

      try {
        const res = await fetch(url);
        const text = await res.text();
        const data = JSON.parse(text);
        const words: string[] = data?.[1]?.[0]?.[1] || [];
        setSuggestions(words);
      } catch (err) {
        console.error("Error fetching/parsing suggestions:", err);
        setSuggestions([]);
      }
    };

    editor.on("update", updateSuggestions);
    updateSuggestions();

    return () => {
      editor.off("update", updateSuggestions);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && suggestions.length > 0 && currentWord) {
        event.preventDefault();
        replaceWord(editor, currentWord, suggestions[0]);
        editor.chain().insertContent(" ").run();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [editor, suggestions, currentWord]);

  const replaceWord = (editor: Editor, oldWord: string, newWord: string) => {
    const { from } = editor.state.selection;
    const text = editor.state.doc.textBetween(0, from, "\n", "\n");
    const match = text.match(/(?:^|\s)(\S+)$/);

    if (!match) return;

    const start = from - match[1].length;
    editor
      .chain()
      .focus()
      .deleteRange({ from: start, to: from })
      .insertContent(newWord)
      .run();
  };

  if (!currentWord) return null;

  return (
    <div className="gap-2 bg-bg-secondary flex-col flex">
      {suggestions.length > 0 ? (
        suggestions.map((s, i) => (
          <button
            key={i}
            className="p-2 rounded-lg text-sm cursor-pointer hover:bg-text-muted"
            onClick={() => replaceWord(editor, currentWord, s + ' ')}
          >
            {s}
          </button>
        ))
      ) : (
        <button className="p-2 rounded-lg text-sm bg-bg-secondary border border-text-muted cursor-pointer">
          {currentWord}
        </button>
      )}
              <button onClick={() => replaceWord(editor, currentWord, currentWord + ' ')} className="p-2 bg-text-primary text-bg-primary rounded-lg text-sm cursor-pointer hover:bg-text-muted">
          {currentWord}
        </button>
    </div>
  );
}
