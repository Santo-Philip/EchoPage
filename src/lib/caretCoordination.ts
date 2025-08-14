import { Extension } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'

export const CaretPosition = Extension.create({
  name: 'caretPosition',

  addOptions() {
    return {
      setCoords: undefined,
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleTextInput: (view, from, to, text) => {
            if (!this.options.setCoords) return false

            const { $anchor } = view.state.selection
            const coords = view.coordsAtPos($anchor.pos)

            this.options.setCoords({
              top: coords.top,
              bottom: coords.bottom,
              left: coords.left,
              right: coords.right,
            })

            return false
          },

          handleKeyDown: (view, event) => {
            if (!this.options.setCoords) return false

            const { $anchor } = view.state.selection
            const coords = view.coordsAtPos($anchor.pos)

            this.options.setCoords({
              top: coords.top,
              bottom: coords.bottom,
              left: coords.left,
              right: coords.right,
            })

            return false
          },
        },
      }),
    ]
  },
})
