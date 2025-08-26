import aiClient from "../aiClient";

async function slugify(title: string) {
  const value = await aiClient({
    system: "You are the best slug generator for SEO.",
    prompt: `Generate a clean, short SEO-friendly slug from: "${title}". 
    Return only the slug, lowercase, words separated by hyphens. No extra text.`,
  });

  let slug = (value || "").trim().toLowerCase();
  if (!slug) slug = `post-${Date.now()}`;
  console.log(slug);
  return slug;
}

export default slugify;