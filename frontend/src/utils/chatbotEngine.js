import { sortCollegesByRatingTier, dedupeColleges } from "./college";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyAReZ6uGjCKrSluYUQeC56nu-k7n4C60wY";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
const DOMAIN_LOCK_MESSAGE = "I can only help with education-related queries";
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

function getCollegeGoogleSearchLink(college) {
  const q = `${college?.name || ""} ${college?.location || ""} college details`.trim();
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}

function rankToMinRating(rank) {
  if (rank < 2000) return 4.7;
  if (rank < 5000) return 4.5;
  if (rank < 10000) return 4.3;
  return 4.0;
}

function localRecommendByRank(userText, colleges) {
  const rankMatch = String(userText || "").match(/\b\d{2,6}\b/);
  if (!rankMatch) return null;
  const rank = Number(rankMatch[0]);
  if (!Number.isFinite(rank)) return null;
  const minRating = rankToMinRating(rank);
  const picks = colleges
    .filter((c) => Number(c.rating || 0) >= minRating)
    .sort(sortCollegesByRatingTier)
    .slice(0, 4);
  return {
    text: `Based on rank ${rank}, these colleges look suitable. You can compare them for final decision-making.`,
    colleges: picks,
  };
}

function localRecommendByInterest(userText, colleges) {
  const q = String(userText || "").toLowerCase();
  const hasInterestCue = ["interest", "recommend", "suggest", "best course", "best colleges", "career"].some((x) =>
    q.includes(x)
  );
  if (!hasInterestCue) return null;
  const picks = colleges.slice().sort(sortCollegesByRatingTier).slice(0, 4);
  return {
    text: "These are strong options to start with. Use Save for shortlist and Compare to evaluate side by side.",
    colleges: picks,
  };
}

/**
 * Parse Gemini text response into segments format
 * @param {string} text - Gemini response
 * @param {Array} colleges - Available colleges
 * @returns {Array} segments
 */
function parseGeminiResponse(text, colleges) {
  // Extract JSON if present, fallback to plain text
  let jsonData = null;
  try {
    const jsonMatch = text.match(/\{[\\s\\S]*\}/);
    if (jsonMatch) {
      jsonData = JSON.parse(jsonMatch[0]);
    }
  } catch {}

  const segments = [];

  if (jsonData) {
    // Add main text
    if (jsonData.text) {
      segments.push({ type: "text", text: jsonData.text });
    }

    // Add colleges chips if provided
    if (jsonData.colleges && Array.isArray(jsonData.colleges)) {
      const validColleges = dedupeColleges(jsonData.colleges.filter(c => 
        colleges.some(existing => String(existing.id) === String(c.id))
      ));
      if (validColleges.length) {
        segments.push({ type: "colleges", colleges: validColleges });
      }
    }

    // Add link if provided
    if (jsonData.link && jsonData.link.href) {
      segments.push({ 
        type: "link", 
        href: jsonData.link.href, 
        linkLabel: jsonData.link.label || "Visit website" 
      });
    }
  } else {
    // Plain text fallback
    segments.push({ type: "text", text: text });
  }

  return segments;
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

  const mentionedCollege = getMentionedCollege(userText, list);
  if (mentionedCollege) {
    return {
      segments: [
        {
          type: "text",
          text: `${mentionedCollege.name} is in ${mentionedCollege.location}. Fees are around ₹${mentionedCollege.fees}, rating is ${mentionedCollege.rating}, and placement is ${mentionedCollege.placement}%.`,
        },
        {
          type: "link",
          href: getCollegeGoogleSearchLink(mentionedCollege),
          linkLabel: `Search ${mentionedCollege.name} on Google`,
        },
      ],
    };
  }

  const rankBased = localRecommendByRank(userText, list);
  if (rankBased && rankBased.colleges.length) {
    return {
      segments: [
        { type: "text", text: rankBased.text },
        { type: "colleges", colleges: rankBased.colleges },
      ],
    };
  }

  const interestBased = localRecommendByInterest(userText, list);
  if (interestBased && interestBased.colleges.length) {
    return {
      segments: [
        { type: "text", text: interestBased.text },
        { type: "colleges", colleges: interestBased.colleges },
      ],
    };
  }

  if (!GEMINI_API_KEY) {
    return {
      segments: [
        {
          type: "text",
          text: "I can help with colleges, courses, careers, and rank-based suggestions. Add a Gemini API key to enable deeper guidance.",
        },
      ],
    };
  }

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an education chatbot for College Explorer. 

MANDATORY RULES:
1. ONLY respond to education/college queries (courses, ranks, admissions, careers).
2. For ANY other topic: EXACTLY respond: "${DOMAIN_LOCK_MESSAGE}"
3. ONLY suggest colleges from provided data.
4. Response format: JSON object only - { "text": "your response", "colleges": [{"id": "123", "name": "College X", "location": "Delhi", "fees": "5L", "rating": "4.8", "placement": "90%"}], "link": {"href": "url", "label": "text"} }
5. Match college IDs exactly.
6. For ranks/interests: suggest 3-4 top matches.
7. Keep friendly/professional/minimal.

COLLEGE DATA SUMMARY (use IDs/names accurately):
${list.slice(0, 50).map(c => `ID:${c.id} ${c.name} (${c.location}) rating:${c.rating} fees:${c.fees}`).join('; ')}

User: ${userText}`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, couldn't process that.";

    // Education guardrail check
    if (geminiText.includes(DOMAIN_LOCK_MESSAGE)) {
      return { segments: [{ type: "text", text: DOMAIN_LOCK_MESSAGE }] };
    }

    const segments = parseGeminiResponse(geminiText, list);
    return { segments };
  } catch (error) {
    console.warn("Gemini API failed, using local fallback:", error);
    return {
      segments: [
        {
          type: "text",
          text: "I can help with rank-based suggestions, course guidance, and college lookup. Try mentioning your rank or a specific college name.",
        },
      ],
    };
  }
}

// Export sync wrapper for backward compat
export function buildChatbotReplySync(userText, colleges) {
  return buildChatbotReply(userText, colleges);
}

