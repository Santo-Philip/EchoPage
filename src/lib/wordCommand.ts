import { Extension } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import Suggestion from "@tiptap/suggestion";

export const LangCommand = Extension.create({
  name: "langCommand",

  addOptions() {
    return {
      setLangShow: false,
      setRange: undefined,
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '<',
        startOfLine: false,
        pluginKey: new PluginKey("wordSuggestion"),

        render: () => {
          return {
            onStart: (props) => {
              this.options.setRange?.(props.range);
              this.options.setLangShow?.(true);
              document.documentElement.style.overflowY = "hidden";

            },
            onExit: () => {
              this.options.setLangShow?.(false);
              this.editor?.chain().focus().run();
              document.documentElement.style.overflowY = "auto";
            },
            onKeyDown: ({ event }) => {
              if (event.key === "Escape") {
                this.options.setLangShow?.(false);
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
