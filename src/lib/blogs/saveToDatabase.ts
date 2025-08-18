
export interface DraftContent {
  title?: string;
  value?: string;
  desc?: string;
  img?: string;
  content?: string;
  slug?: string;
  lang?: string;
  status?: string;
  updated_at?: string;
}

async function saveToDatabase(blogId: string, data: DraftContent) {
  if (!navigator.onLine) return;

  try {
    const response = await fetch(`/api/crud/data/${blogId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
    window.showToast('Something went wrong')
    throw new Error(`Failed to save. Status: ${response.status}`);
      
    }

    window.showToast('Success')
  } catch (err) {
    console.error("Failed to save to Supabase:", err);
    window.showToast('Something went wrong')
  }
}

export default saveToDatabase;
