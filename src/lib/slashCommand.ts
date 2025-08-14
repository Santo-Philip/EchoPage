import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      setShow: undefined, // pass your React setShow
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '/',
        items: () => [], // no items needed yet
        command: () => {}, // no-op command
        render: () => {
          return {
            onStart: () => {
              this.options.setShow?.(true) 
                  console.log("sdada")
            },
            onExit: () => {
              this.options.setShow?.(false) 
                  console.log("exit")
            },
          }
        },
      }),
    ]
  },
})
