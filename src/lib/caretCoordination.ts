import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';

export const CaretPosition = Extension.create({
  name: 'caretPosition',

  addOptions() {
    return {
      setCoords: undefined,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleTextInput: (view, from, to, text) => {
            if (!this.options.setCoords) return false;

            try {
              const { $anchor } = view.state.selection;
              const coords = view.coordsAtPos($anchor.pos);

              if (coords) {
                this.options.setCoords({
                  left: coords.left,
                  bottom: coords.bottom,
                });
              }
            } catch (error) {
              console.error('CaretPosition: Error getting coords on text input:', error);
            }

            return false;
          },

          handleKeyDown: (view, event) => {
            if (!this.options.setCoords) return false;

            try {
              const { $anchor } = view.state.selection;
              const coords = view.coordsAtPos($anchor.pos);

              if (coords) {
                this.options.setCoords({
                  left: coords.left,
                  bottom: coords.bottom,
                });
               
              }
            } catch (error) {
              console.error('CaretPosition: Error getting coords on keydown:', error);
            }

            return false;
          },
        },
      }),
    ];
  },
});