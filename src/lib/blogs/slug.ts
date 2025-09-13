import aiClient from "../aiClient";

function localSlugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

async function slugify(title: string) {
  let slug = "";

  try {
    const value = await aiClient({
      system: "You are the best slug generator for SEO.",
      prompt: `Generate a clean, short SEO-friendly slug from: "${title}". 
      Return only the slug, lowercase, words separated by hyphens. No extra text.`,
    });

    slug = (value || "").trim().toLowerCase();
  } catch (err) {
    console.error("AI slug generation failed:", err);
  }

  // Fallback if AI fails or returns empty
  if (!slug) {
    slug = localSlugify(title);
    if (!slug) slug = `post-${Date.now()}`;
  }

  return slug;
}

export default slugify;
