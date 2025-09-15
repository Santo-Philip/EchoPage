import type { DraftContent } from "./saveToDatabase";
import saveToDatabase from "./saveToDatabase";

let saveTimeout: ReturnType<typeof setTimeout>;

function autoSave(blogId: string, content: DraftContent): Promise<boolean> {
  return new Promise((resolve, reject) => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      try {
        const success = await saveToDatabase(blogId, content);
        resolve(success ?? false); // resolves true or false, defaults to false if undefined
      } catch (err) {
        reject(err);
      }
    }, 800);
  });
}

export default autoSave;
