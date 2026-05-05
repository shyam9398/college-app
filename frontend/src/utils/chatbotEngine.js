import { getCollegeWebsiteUrl } from "./collegeWebsite";
import { sortCollegesByRatingTier } from "./college";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
const DOMAIN_LOCK_MESSAGE = "I only help with education-related queries.";
const DOMAIN_KEYWORDS = [
  "college",
  "university",
  "campus",
  "course",
  "branch",
  "stream",
  "degree",
  "btech",
  "engineering",
  "career",
  "admission",
  "rank",
  "fees",
  "placement",
  "rating",
  "ai",
  "cse",
  "mechanical",
  "civil",
  "electrical",
  "andhra",
  "hyderabad",
  "delhi",
  "mumbai",
  "bangalore",
  "iit",
  "nit",
  "cse",
  "ai",
  "it",
  "ece",
];

function isEducationQuery(text) {
  const query = String(text || "").toLowerCase();
  return DOMAIN_KEYWORDS.some((k) => query.includes(k));
}

function getMentionedCollege(userText, colleges) {
  const query = String(userText || "").toLowerCase().trim();
  if (!query) return null;
  return colleges.find((c) => query.includes(String(c.name || "").toLowerCase()));
}

const BRANCH_INFO = {
  cse: {
    full_form: "Computer Science and Engineering",
    description: "Focuses on programming, software systems and AI basics.",
    career_options: "Software Engineer, Data Scientist, AI Engineer",
    avg_salary: "8 LPA",
  },
  ai: {
    full_form: "Artificial Intelligence",
    description: "Focuses on machine learning, deep learning and data-driven systems.",
    career_options: "AI Engineer, ML Engineer, Data Scientist",
    avg_salary: "9 LPA",
  },
  it: {
    full_form: "Information Technology",
    description: "Focuses on software systems, cloud and networking.",
    career_options: "IT Engineer, Cloud Engineer, System Engineer",
    avg_salary: "7.5 LPA",
  },
  ece: {
    full_form: "Electronics and Communication Engineering",
    description: "Focuses on electronics, communication and embedded systems.",
    career_options: "Embedded Engineer, Telecom Engineer, Electronics Engineer",
    avg_salary: "6 LPA",
  },
};

function rankToMinRating(rank) {
  if (rank < 2000) return 4.7;
  if (rank < 5000) return 4.5;
  if (rank < 10000) return 4.3;
  return 4.0;
}

function getRankFromText(text) {
  const rankMatch = String(text || "").match(/\b\d{2,6}\b/);
  if (!rankMatch) return null;
  const rank = Number(rankMatch[0]);
  return Number.isFinite(rank) ? rank : null;
}

function formatCollegeReason(college, contextText) {
  return `${college.name} is a strong choice with ${college.placement}% placement and ${college.rating} rating. Best for students targeting ${contextText}.`;
}

function buildRankReply(rank, colleges) {
  const minRating = rankToMinRating(rank);
  const picks = colleges.filter((c) => Number(c.rating || 0) >= minRating).sort(sortCollegesByRatingTier).slice(0, 4);
  if (!picks.length) return null;
  return {
    segments: [
      { type: "text", text: `Based on your rank ${rank}, these are realistic options.` },
      { type: "colleges", colleges: picks },
      { type: "text", text: `${formatCollegeReason(picks[0], "your current rank band")} You can compare these colleges or save them.` },
    ],
  };
}

function parseBranch(text) {
  const q = String(text || "").toLowerCase();
  if (q.includes("cse")) return "cse";
  if (q.includes("ai")) return "ai";
  if (q.includes("it")) return "it";
  if (q.includes("ece")) return "ece";
  return null;
}

function parseLocation(text) {
  const q = String(text || "").toLowerCase();
  const m = q.match(/\bin\s+([a-z\s]+)$/i);
  if (m?.[1]) return m[1].trim();
  return ["andhra pradesh", "hyderabad", "delhi", "mumbai", "bangalore"].find((k) => q.includes(k)) || null;
}

function buildRecommendationByProfile(rank, branch, location, colleges) {
  const lowerBranch = branch || "cse";
  const filtered = colleges
    .filter((c) => Number(c.cutoff_rank || 0) >= rank)
    .filter((c) =>
      Array.isArray(c.courses) ? c.courses.some((course) => String(course).toLowerCase().includes(lowerBranch)) : true
    )
    .filter((c) => (location ? String(c.location || "").toLowerCase().includes(location) : true))
    .sort((a, b) => {
      const nirf = (Number(a.nirf_rank) || 9999) - (Number(b.nirf_rank) || 9999);
      if (nirf !== 0) return nirf;
      return (Number(b.rating) || 0) - (Number(a.rating) || 0);
    });

  let picks = filtered.slice(0, 5);
  if (!picks.length) {
    picks = colleges
      .filter((c) => (rank > 30000 ? String(c.type).toLowerCase() === "private" : true))
      .sort(sortCollegesByRatingTier)
      .slice(0, 5);
  }

  const rankAdvice = rank <= 4000 ? "Great rank. IIT/NIT-style options are prioritized." : rank > 30000 ? "Higher rank range detected, so practical private options are included." : "Balanced rank range, so realistic mixed options are shown.";
  return {
    segments: [
      { type: "text", text: `${rankAdvice} Based on your rank and branch preference, these colleges fit best.` },
      { type: "colleges", colleges: picks },
      { type: "text", text: "You can Save or Compare these." },
    ],
  };
}

function buildCollegeDetailReply(college) {
  return {
    segments: [
      {
        type: "text",
        text: `${college.name} is located in ${college.location}. Fees are around ₹${college.fees}, rating is ${college.rating}, and placement is ${college.placement}%. ${college.description || ""}`.trim(),
      },
      { type: "link", href: getCollegeWebsiteUrl(college), linkLabel: `Visit ${college.name} official website` },
      { type: "text", text: "You can compare this college with others or save it for later." },
    ],
  };
}

function buildRatingReply(text, colleges) {
  const m = String(text || "").match(/(?:above|over|>=?|more than)\s*(\d(?:\.\d)?)/i);
  if (!m) return null;
  const min = Number(m[1]);
  if (!Number.isFinite(min)) return null;
  const picks = colleges.filter((c) => Number(c.rating || 0) >= min).sort(sortCollegesByRatingTier).slice(0, 6);
  return {
    segments: [
      { type: "text", text: `Here are colleges with rating ${min}+.` },
      { type: "colleges", colleges: picks },
      { type: "text", text: "These are quality-focused options. Compare fees and placement before deciding." },
    ],
  };
}

function buildLocationReply(text, colleges) {
  const q = String(text || "").toLowerCase();
  const inMatch = q.match(/\bin\s+([a-z\s]+)$/i);
  const locationHint = inMatch ? inMatch[1].trim() : null;
  const state = locationHint || ["andhra pradesh", "hyderabad", "delhi", "mumbai", "bangalore"].find((k) => q.includes(k));
  if (!state) return null;
  const picks = colleges
    .filter((c) => String(c.location || "").toLowerCase().includes(String(state).toLowerCase()))
    .sort(sortCollegesByRatingTier)
    .slice(0, 6);
  return {
    segments: [
      { type: "text", text: `Here are colleges in ${state}.` },
      { type: "colleges", colleges: picks },
      { type: "text", text: "Location fit looks good here. Next step: compare commute, fees, and placements." },
    ],
  };
}

function buildCourseReply(text, colleges) {
  const q = String(text || "").toLowerCase();
  const pickedKey = parseBranch(q) || (q.includes("mechanical") ? "mechanical" : null);
  const picked = pickedKey && BRANCH_INFO[pickedKey]
    ? {
        key: pickedKey,
        title: BRANCH_INFO[pickedKey].full_form,
        careers: BRANCH_INFO[pickedKey].career_options.toLowerCase(),
        desc: BRANCH_INFO[pickedKey].description,
        salary: BRANCH_INFO[pickedKey].avg_salary,
      }
    : null;
  const asksBestCourse = q.includes("best course");
  if (!picked && !asksBestCourse) return null;
  const focus = picked?.key || "cse";
  const top = colleges
    .filter((c) => Array.isArray(c.courses) && c.courses.some((course) => String(course).toLowerCase().includes(focus)))
    .sort(sortCollegesByRatingTier)
    .slice(0, 4);
  const intro = picked
    ? `${picked.title}: ${picked.desc} Careers: ${picked.careers}. Typical average salary is around ${picked.salary}.`
    : "Choose a course based on your strengths: coding and problem-solving usually align with CSE/AI; hands-on hardware aligns with core branches.";
  return {
    segments: [
      { type: "text", text: `${intro} These colleges are strong for this path.` },
      { type: "colleges", colleges: top },
      { type: "text", text: "You can compare these colleges or save them to shortlist." },
    ],
  };
}

function buildTopCollegesReply(colleges) {
  const top = colleges.slice().sort(sortCollegesByRatingTier).slice(0, 5);
  return {
    segments: [
      { type: "text", text: "These are top colleges by rating and outcomes." },
      { type: "colleges", colleges: top },
      { type: "text", text: "Best suited for students aiming for strong placements and academic rigor." },
    ],
  };
}

/**
 * Call Gemini API
 * @param {string} userText
 * @param {Array} colleges
 * @returns {Promise<{ segments: Array }>}
 */
export async function buildChatbotReply(userText, colleges) {
  const list = Array.isArray(colleges) ? colleges : [];
  
  if (!userText?.trim()) {
    return { 
      segments: [{ type: "text", text: "Hi! Ask about colleges, courses, ranks, or careers. Use quick buttons or type your query." }] 
    };
  }

  if (!isEducationQuery(userText)) {
    return { segments: [{ type: "text", text: DOMAIN_LOCK_MESSAGE }] };
  }

  const rank = getRankFromText(userText);
  const branch = parseBranch(userText);
  const location = parseLocation(userText);
  if (rank) {
    if (branch || location) {
      return buildRecommendationByProfile(rank, branch, location, list);
    }
    const rankReply = buildRankReply(rank, list);
    if (rankReply) return rankReply;
  }

  const mentionedCollege = getMentionedCollege(userText, list);
  if (mentionedCollege) {
    return buildCollegeDetailReply(mentionedCollege);
  }

  const ratingReply = buildRatingReply(userText, list);
  if (ratingReply) return ratingReply;

  const locationReply = buildLocationReply(userText, list);
  if (locationReply) return locationReply;

  const courseReply = buildCourseReply(userText, list);
  if (courseReply) return courseReply;

  if (String(userText).toLowerCase().includes("top colleges")) {
    return buildTopCollegesReply(list);
  }

  const defaultGuidance = {
    segments: [
      {
        type: "text",
        text: "Try: rank + branch (e.g. 'rank 7000 CSE in Hyderabad'), ask about CSE/AI, or filter by rating/location.",
      },
      { type: "text", text: "You can Save or Compare these." },
    ],
  };

  if (!GEMINI_API_KEY) return defaultGuidance;

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Rewrite this college guidance in 1-2 short helpful lines: "${String(userText).slice(0, 180)}". Keep it decision-oriented.`,
              },
            ],
          },
        ],
      }),
    });
    if (!response.ok) return defaultGuidance;
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return defaultGuidance;
    return { segments: [{ type: "text", text }, ...defaultGuidance.segments.slice(1)] };
  } catch {
    return defaultGuidance;
  }
}

// Export sync wrapper for backward compat
export function buildChatbotReplySync(userText, colleges) {
  return buildChatbotReply(userText, colleges);
}

