import { getCollegeWebsiteUrl } from "./collegeWebsite";

const COURSE_CATALOG = {
  cse: "Computer Science and Engineering (CSE)",
  ai: "Artificial Intelligence and Data Science",
  it: "Information Technology",
  ece: "Electronics and Communication Engineering",
  eee: "Electrical and Electronics Engineering",
  mechanical: "Mechanical Engineering",
  civil: "Civil Engineering",
  biotech: "Biotechnology",
};

const ENTRANCE_EXAMS = ["JEE Main", "JEE Advanced", "State CET"];
const PRIVATE_HINTS = ["amity", "vit", "srm", "manipal", "private"];

function inferCourses(collegeName = "") {
  const n = String(collegeName).toLowerCase();
  const base = [COURSE_CATALOG.cse, COURSE_CATALOG.ai, COURSE_CATALOG.ece, COURSE_CATALOG.mechanical];
  if (n.includes("technology") || n.includes("iit") || n.includes("nit")) return base;
  if (n.includes("medical")) return ["MBBS", "Nursing", "Biotechnology"];
  return [COURSE_CATALOG.cse, COURSE_CATALOG.it, COURSE_CATALOG.ece, COURSE_CATALOG.civil];
}

function buildDescription(college) {
  const rating = Number(college.rating) || 0;
  if (rating >= 4.7) return "Top-tier option with strong academics and excellent placements.";
  if (rating >= 4.4) return "Strong option with good faculty support and consistent outcomes.";
  return "Balanced option with practical learning and value-focused education.";
}

function inferType(collegeName = "") {
  const n = String(collegeName).toLowerCase();
  if (n.includes("iit") || n.includes("nit")) return "Government";
  if (PRIVATE_HINTS.some((k) => n.includes(k))) return "Private";
  return "Government";
}

function inferNirfRank(college, index) {
  const rating = Number(college.rating) || 4;
  const base = Math.max(1, Math.round((5 - rating) * 60));
  return base + (index % 25);
}

function inferCutoffRank(college) {
  const rating = Number(college.rating) || 4;
  if (rating >= 4.7) return 2500;
  if (rating >= 4.5) return 6000;
  if (rating >= 4.3) return 12000;
  return 25000;
}

export function enrichCollegeData(colleges) {
  return (Array.isArray(colleges) ? colleges : []).map((college, index) => {
    const website = college.website || getCollegeWebsiteUrl(college);
    const courses = Array.isArray(college.courses) && college.courses.length ? college.courses : inferCourses(college.name);
    const rating = Number(college.rating) || 4;
    return {
      ...college,
      website,
      website_link: college.website_link || website,
      courses,
      description: college.description || buildDescription(college),
      type: college.type || inferType(college.name),
      nirf_rank: college.nirf_rank || inferNirfRank(college, index),
      entrance_exam: college.entrance_exam || ENTRANCE_EXAMS.join(" / "),
      cutoff_rank: college.cutoff_rank || inferCutoffRank(college),
      placement_avg: college.placement_avg || `${Math.round((Number(college.placement) || 70) / 10)} LPA`,
      rating,
    };
  });
}
