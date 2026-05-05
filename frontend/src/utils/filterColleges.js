import { parseFeeRupees } from "./feesParse";
import { sortCollegesByRatingTier } from "./college";

export const FEES_FILTER_OPTIONS = [
  { value: "all", label: "All fees" },
  { value: "0-500000", label: "Under ₹5L" },
  { value: "500000-1000000", label: "₹5L – ₹10L" },
  { value: "1000000-2000000", label: "₹10L – ₹20L" },
  { value: "2000000-999999999", label: "Above ₹20L" },
];

export const RATING_FILTER_OPTIONS = [
  { value: "all", label: "Any rating" },
  { value: "4.5", label: "4.5+" },
  { value: "4.3", label: "4.3+" },
  { value: "4.0", label: "4.0+" },
];

export const COURSE_FILTER_OPTIONS = [
  { value: "All", label: "All courses" },
  { value: "CSE", label: "CSE" },
  { value: "ECE", label: "ECE" },
  { value: "Mechanical", label: "Mechanical" },
  { value: "IT", label: "IT" },
  { value: "EEE", label: "EEE" },
  { value: "CIVIL", label: "CIVIL" },
  { value: "AIML", label: "AIML" },
  { value: "AIDS", label: "AIDS" },
];

function matchesCourse(courses, selectedCourse) {
  if (!Array.isArray(courses)) return false;
  const sc = String(selectedCourse || "").toLowerCase();
  const aliases = {
    aiml: ["aiml", "artificial intelligence", "machine learning", "ai"],
    aids: ["aids", "artificial intelligence and data science", "data science", "ai"],
    civil: ["civil"],
    eee: ["eee", "electrical and electronics"],
    it: ["it", "information technology"],
  };
  const keys = aliases[sc] || [sc];
  return courses.some((course) => {
    const lc = String(course || "").toLowerCase();
    return keys.some((k) => lc.includes(k));
  });
}

function feesInRange(feesValue, rangeKey) {
  if (!rangeKey || rangeKey === "all") return true;
  const fee = parseFeeRupees(feesValue);
  if (!Number.isFinite(fee)) return true;
  const [a, b] = rangeKey.split("-").map((x) => parseInt(x, 10));
  if (!Number.isFinite(a) || !Number.isFinite(b)) return true;
  return fee >= a && fee <= b;
}

/**
 * @param {Array} colleges
 * @param {{ search: string, location: string, feesRange: string, ratingMin: string, course: string }} criteria
 */
export function filterColleges(colleges, { search, location, feesRange, ratingMin, course }) {
  const q = (search || "").trim().toLowerCase();
  const minRating = ratingMin && ratingMin !== "all" ? Number(ratingMin) : null;
  const selectedCourse = String(course || "All").toLowerCase();

  const list = (colleges || []).filter((c) => {
    const name = (c.name || "").toLowerCase();
    if (q && !name.includes(q)) return false;
    if (location && location !== "All" && c.location !== location) return false;
    if (!feesInRange(c.fees, feesRange)) return false;
    if (minRating != null && !Number.isNaN(minRating)) {
      const r = Number(c.rating);
      if (Number.isNaN(r) || r < minRating) return false;
    }
    if (selectedCourse !== "all") {
      const hasCourse = matchesCourse(c.courses, selectedCourse);
      if (!hasCourse) return false;
    }
    return true;
  });

  return [...list].sort(sortCollegesByRatingTier);
}
