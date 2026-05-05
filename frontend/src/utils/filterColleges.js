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
  { value: "B.Tech", label: "B.Tech" },
  { value: "MBA", label: "MBA" },
  { value: "B.Com", label: "B.Com" },
  { value: "MBBS", label: "MBBS" },
  { value: "LLB", label: "LLB" },
];

function matchesCourse(courseName, courses, selectedCourse) {
  const sc = String(selectedCourse || "").toLowerCase();
  const normalizedCourse = String(courseName || "").toLowerCase().trim();
  if (normalizedCourse === sc) return true;
  if (!Array.isArray(courses)) return false;
  return courses.some((course) =>
    String(course || "").toLowerCase().includes(sc)
  );
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
 * @param {{ search: string, location: string, feesRange: string, ratingMin: string, course: string, goal: string }} criteria
 */
export function filterColleges(colleges, { search, location, feesRange, ratingMin, course, goal = 'All' }) {
  const GOAL_TO_COURSE_MAP = {
    Engineering: 'B.Tech',
    Medicine: 'MBBS',
    Law: 'LLB',
    MBA: 'MBA',
    Design: 'B.Des',
    Science: 'B.Sc'
  };
  let effectiveCourse = course;
  if (goal !== 'All' && !course) {
    effectiveCourse = GOAL_TO_COURSE_MAP[goal] || goal;
  }
  const q = (search || "").trim().toLowerCase();
  const minRating = ratingMin && ratingMin !== "all" ? Number(ratingMin) : null;
  const selectedCourse = String(effectiveCourse || "All").toLowerCase();

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
      const hasCourse = matchesCourse(c.course, c.courses, selectedCourse);
      if (!hasCourse) return false;
    }
    return true;
  });

  return [...list].sort(sortCollegesByRatingTier);
}
