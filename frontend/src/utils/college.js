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
