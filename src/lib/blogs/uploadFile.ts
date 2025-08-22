import autoSave from "./autosave";
import { getSearchParam } from "./getParams";

 const uploadFileToApi = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/crud/files/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Upload failed");
    }
    const data = await response.json();
    const id = getSearchParam("id");
    autoSave(id, { thumb: data.url });
    return data.url as string;
  };
  export default uploadFileToApi;