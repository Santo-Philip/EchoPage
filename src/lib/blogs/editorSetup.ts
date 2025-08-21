import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import Highlight from '@tiptap/extension-highlight';
import { Placeholder } from '@tiptap/extensions';
import { SlashCommand } from '@/lib/slashCommand';
import { CaretPosition } from '@/lib/caretCoordination';

interface EditorConfigProps {
  setShow: (visible: boolean | ((prev: boolean) => boolean)) => void;
  setRange: (range: { from: number; to: number }) => void;
  setCoords: (coords: { top: number; bottom: number; left: number; right: number }) => void;
}

export function getEditorConfig({ setShow, setRange, setCoords }: EditorConfigProps) {
  return {
    extensions: [
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Highlight.configure({ multicolor: true }),
      Superscript,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Youtube.configure({
        addPasteHandler: true,
        allowFullscreen: true,
        controls: true,
      }),
      Link.configure({
        linkOnPaste: true,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder: 'Press \'/\' to open command menu, start typing here',
      }),
      SlashCommand.configure({
        setShow,
        setRange,
      }),
      CaretPosition.configure({
        setCoords,
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none p-3 min-h-screen bg-white rounded-lg shadow-sm',
      },
    },
    autofocus: true,
  };
}