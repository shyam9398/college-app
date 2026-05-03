/** Static enrichments for the detail view (API has no courses/facilities fields). */
export function getDetailExtras(college) {
  const name = college?.name || "This institution";
  return {
    courses: [
      "B.Tech — Computer Science & Engineering",
      "B.Tech — Electronics & Communication",
      "B.Tech — Mechanical Engineering",
      "M.Tech — VLSI & Embedded Systems",
      "MBA — Business Analytics",
    ],
    facilities: [
      "Library — digital catalog & study halls",
      "Hostel — separate wings for UG/PG",
      "Labs — computing, chemistry, and workshop facilities",
    ],
    admission: `${name} admits students through national and state-level entrance examinations. Typical steps: online application, entrance test / merit rank, counseling, and document verification. Deadlines and fee structures are published on the official admissions portal each academic year. Scholarships may be available for top ranks; contact the admissions office for the latest brochure.`,
  };
}
