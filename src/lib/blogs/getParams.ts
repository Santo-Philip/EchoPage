/**
 * Get a search param value from the current URL
 * @param key The query parameter name
 * @returns The value or null if not found
 */
export function getSearchParam(key: string): string  {
  if (typeof window === "undefined") return '';
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key) || '';
}

