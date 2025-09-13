
export interface DraftContent {
  title?: string;
  value?: string;
  desc?: string;
  thumb?: string;
  content_json?: string;
  content_html? : string;
  slug?: string;
  lang?: string;
  status?: "draft" | "public" | "pending" | "archived" | "reject";
  updated_at?: string;
  tags?: string[];
  category?: string;
  keywords?: string[];
  author?: string;
  schedule? : string;
  featured?: boolean;
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

      return window.showToast('Something went wrong', 3000, 'error');
    }
  } catch (err) {
    console.error("Failed to save to Supabase:", err);
    return window.showToast('Something went wrong', 3000, 'error');
  }
}

export default saveToDatabase;
