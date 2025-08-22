import React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import type { Editor } from "@tiptap/core";
import { compressImage } from "@/lib/compress";
import autoSave from "@/lib/blogs/autosave";
import { getSearchParam } from "@/lib/blogs/getParams";
import aiClient from "@/lib/aiClient";
import uploadFileToApi from "@/lib/blogs/uploadFile";

interface SlashMenuProps {
  show: boolean;
  coords: { left: number; bottom: number };
  editor: Editor | null;
  range: { from: number; to: number };
}

export const SlashMenu: React.FC<SlashMenuProps> = ({
  show,
  coords,
  editor,
  range,
}) => {
 

  const deleteFileFromApi = async (url: string): Promise<void> => {
    const res = await fetch("/api/crud/files/remove", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) {
      window.showToast("Something went wrong");
    } else {
      window.showToast("File deleted successfully");
    }
  };
  if (!show) return null;
  
  const items = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 16 16"
        >
          <path stroke="currentColor" d="M8 1.5H3.5a1 1 0 0 0-1 1v11" />
          <path stroke="currentColor" d="M14 14.5H3.5a1 1 0 1 1 0-2h10V8" />
          <path
            fill="currentColor"
            d="m11.5.5.99 2.51L15 4l-2.51.99-.99 2.51-.99-2.51L8 4l2.51-.99L11.5.5ZM7.5 5l.707 1.793L10 7.5l-1.793.707L7.5 10l-.707-1.793L5 7.5l1.793-.707L7.5 5Z"
          />
        </svg>
      ),
      title: "AI Complete",
      onSelect: async () => {
        let buffer = "";

        try {
          for await (const token of await aiClient({
            prompt: `Complete this : ${editor?.getText()}`,
            system:
              "Output ONLY valid Tiptap JSON nodes.Atleast 500 words. Use heading nodes for titles, paragraph for text, and include bold, italic,strike, underline, links, or code and quote,text alignment center ,right , left and list where appropriate. Do NOT include raw text or explanations.",
          })) {
            if (!token) continue;
            buffer += token;

            try {
              const parsed = JSON.parse(buffer);
              if (Array.isArray(parsed.content)) {
                parsed.content.forEach((node: any) => {
                  editor?.commands.insertContent(node);
                });
              } else {
                editor?.commands.insertContent(parsed);
              }
              buffer = "";
            } catch {
              continue;
            }
          }
        } catch (err) {
          console.error("Error during AI streaming insert:", err);
        }
      },
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-heading1-icon lucide-heading-1"
        >
          <path d="M4 12h8" />
          <path d="M4 18V6" />
          <path d="M12 18V6" />
          <path d="m17 12 3-2v8" />
        </svg>
      ),
      title: "Heading 1",
      onSelect: () => {
        editor?.chain().focus().setHeading({ level: 1 }).run();
      },
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-heading2-icon lucide-heading-2"
        >
          <path d="M4 12h8" />
          <path d="M4 18V6" />
          <path d="M12 18V6" />
          <path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
        </svg>
      ),
      title: "Heading 2",
      onSelect: () => {
        editor?.chain().focus().setHeading({ level: 2 }).run();
      },
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-heading3-icon lucide-heading-3"
        >
          <path d="M4 12h8" />
          <path d="M4 18V6" />
          <path d="M12 18V6" />
          <path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2" />
          <path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2" />
        </svg>
      ),
      title: "Heading 3",
      onSelect: () => {
        editor?.chain().focus().setHeading({ level: 3 }).run();
      },
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-type-icon lucide-type"
        >
          <path d="M12 4v16" />
          <path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2" />
          <path d="M9 20h6" />
        </svg>
      ),
      title: "Text",
      onSelect: () => {
        editor?.chain().focus().setParagraph().run();
      },
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-align-center-icon lucide-align-center"
        >
          <path d="M17 12H7" />
          <path d="M19 18H5" />
          <path d="M21 6H3" />
        </svg>
      ),
      title: "Text Center",
      onSelect: () => {
        editor?.chain().focus().setTextAlign("center").run();
      },
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-align-left-icon lucide-align-left"
        >
          <path d="M15 12H3" />
          <path d="M17 18H3" />
          <path d="M21 6H3" />
        </svg>
      ),
      title: "Text Left",
      onSelect: () => {
        editor?.chain().focus().setTextAlign("left").run();
      },
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-align-right-icon lucide-align-right"
        >
          <path d="M21 12H9" />
          <path d="M21 18H7" />
          <path d="M21 6H3" />
        </svg>
      ),
      title: "Text Right",
      onSelect: () => {
        editor?.chain().focus().setTextAlign("right").run();
      },
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-quote-icon lucide-quote"
        >
          <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
          <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
        </svg>
      ),
      title: "Quote",
      onSelect: () => {
        editor?.chain().focus().setBlockquote().run();
      },
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-code-icon lucide-code"
        >
          <path d="m16 18 6-6-6-6" />
          <path d="m8 6-6 6 6 6" />
        </svg>
      ),
      title: "Code",
      onSelect: () => {
        editor?.chain().focus().setCodeBlock().run();
      },
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-list-icon lucide-list"
        >
          <path d="M3 12h.01" />
          <path d="M3 18h.01" />
          <path d="M3 6h.01" />
          <path d="M8 12h13" />
          <path d="M8 18h13" />
          <path d="M8 6h13" />
        </svg>
      ),
      title: "List",
      onSelect: () => {
        editor?.chain().focus().toggleBulletList().run();
      },
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-bold-icon lucide-bold"
        >
          <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
        </svg>
      ),
      title: "Bold",
      onSelect: () => {
        editor?.chain().focus().toggleBold().run();
      },
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-bold-icon lucide-bold"
        >
          <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
        </svg>
      ),
      title: "YouTube",
      onSelect: () => {
        const url = window.prompt("Gib your link here...");
        if (url) {
          editor?.chain().focus().setYoutubeVideo({ src: url }).run();
        }
      },
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-image-icon lucide-image"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      ),
      title: "Image",
      onSelect: async () => {
        const [fileHandle] = await (window as any).showOpenFilePicker({
          types: [
            {
              description: "Images",
              accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] },
            },
          ],
          multiple: false,
        });
        const file = await fileHandle.getFile();
        const compressedFile = await compressImage(file);
        const url = await uploadFileToApi(compressedFile);

        if (url) {
          editor?.chain().focus().setImage({ src: url }).run();
        }
      },
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-image-play-icon lucide-image-play"
        >
          <path d="M15 15.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997a1 1 0 0 1-1.517-.86z" />
          <path d="M21 12.17V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
          <path d="m6 21 5-5" />
          <circle cx="9" cy="9" r="2" />
        </svg>
      ),
      title: "Imagelink",
      onSelect: () => {
        const url = window.prompt("Gib your link here...");
        if (url) {
          editor?.chain().focus().setImage({ src: url }).run();
        }
      },
    },
  ];
  return (
    <Tippy
      visible={show}
      interactive
      placement="bottom-start"
      appendTo={document.body}
      getReferenceClientRect={() =>
        new DOMRect(coords.left, coords.bottom, 0, 0)
      }
      render={() => (
        <div className="bg-text-secondary border border-text-muted text-bg-primary rounded  shadow-2xl w-48 max-h-64 overflow-y-auto z-50">
          {items.map((item, i) => (
            <button
              key={i}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                editor?.chain().deleteRange(range).focus().run();
                item.onSelect();
              }}
              className="w-full flex gap-2 text-left px-2 py-1 hover:bg-text-primary/40 cursor-pointer"
            >
              {item.icon} {item.title}
            </button>
          ))}
        </div>
      )}
    />
  );
};
