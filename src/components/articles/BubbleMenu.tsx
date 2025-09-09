import getWordBeforeCaret from "@/lib/editor/getWordBeforeCaret";
import type { Editor } from "@tiptap/core";
import BubbleButton from "./BubbleButton";
import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react/menus";
import { useState } from "react";
import TypeButton from "./TypeButton";
import SlashMenu from "./SlashMenu";

interface BubbleMenuProps {
  editor: Editor;
}

export function BubbleMenu({ editor }: BubbleMenuProps) {
  const [show, setShow] = useState<'select' | 'type' | 'command'>('select')
  return (
    <TiptapBubbleMenu
      className="z-50"
      editor={editor}
      options={{placement : "top"}}
      shouldShow={({ editor, state }) => {
        if (!editor.isFocused) return false;
        const { empty } = state.selection;
        if (!empty) {
          setShow('select');
          return true;
        }
        const word = getWordBeforeCaret(editor);
        if (word && word === "/") {
          setShow('command');
          return true;
        }
        if (word) {
          setShow('type');
          return true;
        }
        return false;
      }}
    >
      {show === 'select' && (
        <>
          <BubbleButton editor={editor} />
        </>
      )}
      {show === 'type' && (
        <>
          <TypeButton editor={editor} />
        </>
      )}
      {show === 'command' && (
        <>
          <SlashMenu editor={editor} />
        </>
      )}
    </TiptapBubbleMenu>
  );
}
