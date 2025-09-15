import type { DraftContent } from "./saveToDatabase";
import saveToDatabase from "./saveToDatabase";

let saveTimeout: ReturnType<typeof setTimeout>;


function autoSave(blogId: string, content: DraftContent) {
  console.log(content)
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
  saveToDatabase(blogId,content)
  }, 800);
}

export default autoSave