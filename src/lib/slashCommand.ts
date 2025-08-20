import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";

export const SlashCommand = Extension.create({
  name: "slashCommand",

  addOptions() {
    return {
      setShow: undefined,
      setRange: undefined,
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: "/",
        startOfLine: false,

        render: () => {
          return {
            onStart: (props) => {
              this.options.setRange?.(props.range);
              this.options.setShow?.(true);
              document.documentElement.style.overflowY = "hidden";

            },
            onExit: () => {
              this.options.setShow?.(false);
              this.editor?.chain().focus().run();
              document.documentElement.style.overflowY = "auto";
            },
            onKeyDown: ({ event }) => {
              if (event.key === "Escape") {
                console.log("SlashCommand: Escape pressed, hiding menu");
                this.options.setShow?.(false);
                this.editor?.chain().focus().run();
                return true;
              }
              return false;
            },
          };
        },
      }),
    ];
  },
});
