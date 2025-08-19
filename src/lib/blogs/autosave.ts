import type { DraftContent } from "./saveToDatabase";
import saveToDatabase from "./saveToDatabase";

let saveTimeout: ReturnType<typeof setTimeout>;


function autoSave(blogId: string, content: DraftContent) {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
   saveToDatabase(blogId,content)
  }, 800);
}

export default autoSave