export function extractBucketAndPath(url: string): { bucket: string; path: string } | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);

    const bucketIndex = parts.indexOf("public") + 1;
    if (bucketIndex <= 0 || bucketIndex >= parts.length) return null;

    const bucket = parts[bucketIndex];
    const path = parts.slice(bucketIndex + 1).join("/");

    return { bucket, path };
  } catch {
    return null;
  }
}
