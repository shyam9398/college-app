/** Stable match for API ids that may be number or string */
export function sameCollege(a, b) {
  if (!a || !b) return false;
  const hasIdA = a.id != null && a.id !== "";
  const hasIdB = b.id != null && b.id !== "";
  if (hasIdA && hasIdB) return String(a.id) === String(b.id);
  return (a.name || "") === (b.name || "") && (a.location || "") === (b.location || "");
}

export function isInCollegeList(list, college) {
  return list.some((x) => sameCollege(x, college));
}

export function dedupeColleges(list) {
  const out = [];
  const seen = new Set();
  for (const c of list || []) {
    const key =
      c?.id != null && c.id !== ""
        ? `id:${String(c.id)}`
        : `nl:${c?.name || ""}|${c?.location || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
  }
  return out;
}

/** Tier 0 = Top Tier (>4.7), 1 = Good Choice (>4.3), 2 = other — matches RatingTag. */
function ratingTier(rating) {
  const r = Number(rating);
  if (Number.isNaN(r)) return 2;
  if (r > 4.7) return 0;
  if (r > 4.3) return 1;
  return 2;
}

/** Top Tier first, then Good, then others; within tier by rating desc, then name. */
export function sortCollegesByRatingTier(a, b) {
  const ta = ratingTier(a.rating);
  const tb = ratingTier(b.rating);
  if (ta !== tb) return ta - tb;
  const ra = Number(a.rating) || 0;
  const rb = Number(b.rating) || 0;
  if (rb !== ra) return rb - ra;
  return String(a.name || "").localeCompare(String(b.name || ""), undefined, { sensitivity: "base" });
}
