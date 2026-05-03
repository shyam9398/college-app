import { dedupeColleges } from "./college";

export const SAVED_KEY = "collegeExplorerSaved";

export function loadSaved() {
  try {
    const raw =
      localStorage.getItem(SAVED_KEY) ?? localStorage.getItem("saved");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    if (!localStorage.getItem(SAVED_KEY) && localStorage.getItem("saved")) {
      localStorage.setItem(SAVED_KEY, raw);
    }
    return dedupeColleges(parsed);
  } catch {
    return [];
  }
}

export function persistSaved(list) {
  const clean = dedupeColleges(list);
  localStorage.setItem(SAVED_KEY, JSON.stringify(clean));
  return clean;
}
