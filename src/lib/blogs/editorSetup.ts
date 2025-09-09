import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import Highlight from '@tiptap/extension-highlight';
import { Placeholder } from '@tiptap/extensions';
import { CaretPosition } from '@/lib/caretCoordination';
import HardBreak from '@tiptap/extension-hard-break';


export function getEditorConfig() {
  return {
    immediatelyRender: false,
    extensions: [
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
      HardBreak,
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        hardBreak : false
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
    ],
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none p-3 min-h-screen bg-white rounded-lg shadow-sm',
      },
    },
    autofocus: true,
  };
}