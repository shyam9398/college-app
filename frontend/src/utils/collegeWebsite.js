/** Resolve a college URL for Redirect Bot. Uses API field when present, else a web search. */
export function getCollegeWebsiteUrl(college) {
  if (!college) return null;
  const raw = college.website ?? college.website_url ?? college.url;
  if (typeof raw === "string") {
    const u = raw.trim();
    if (!u) return null;
    if (/^https?:\/\//i.test(u)) return u;
    if (/^www\./i.test(u)) return `https://${u}`;
  }
  const q = `${college.name || ""} ${college.location || ""} official website`.trim();
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}
