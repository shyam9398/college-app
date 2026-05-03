import { getCollegeWebsiteUrl } from "./collegeWebsite";
import { sortCollegesByRatingTier } from "./college";

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function pickTop(colleges, n = 4) {
  return [...(colleges || [])].sort(sortCollegesByRatingTier).slice(0, n);
}

function byNameHints(colleges, hints) {
  const re = new RegExp(hints.join("|"), "i");
  const matched = (colleges || []).filter((c) => re.test(c.name || ""));
  return matched.length ? pickTop(matched, 6) : pickTop(colleges, 4);
}

/** @returns {{ segments: Array<{ type: string, text?: string, colleges?: object[], college?: object, href?: string, linkLabel?: string }> }} */
export function buildChatbotReply(userText, colleges) {
  const t = norm(userText);
  const list = Array.isArray(colleges) ? colleges : [];

  if (!t) {
    return { segments: [{ type: "text", text: "Ask about interests, your rank, or a college name." }] };
  }

  const rankMatch = t.match(/\brank\s*(?:is|:)?\s*([\d,]+)/i) || t.match(/\b(?:my\s+)?rank\s+([\d,]+)/i);
  const rankNum = rankMatch ? parseInt(String(rankMatch[1]).replace(/\D/g, ""), 10) : null;
  if (rankNum != null && rankNum > 0 && t.includes("rank")) {
    const filtered = list.filter((col) => {
      const rating = Number(col.rating) || 0;
      if (rankNum < 2000) return rating >= 4.7;
      if (rankNum < 5000) return rating >= 4.5;
      if (rankNum < 10000) return rating >= 4.3;
      return rating >= 4.0;
    });
    const picks = pickTop(filtered, 4);
    return {
      segments: [
        {
          type: "text",
          text: `For rank around ${rankNum}, here are strong options from this catalog (by rating bands).`,
        },
        picks.length ? { type: "colleges", colleges: picks } : { type: "text", text: "No colleges match that band in the current dataset." },
      ],
    };
  }

  if (
    /what should i study|what to study|which course|best course|interested in|i like|i love|i want to study/.test(t) ||
    /\b(coding|programmer|software|developer|cs|cse|computer)\b/.test(t)
  ) {
    const picks = /\b(business|mba|bba|management|commerce)\b/.test(t)
      ? byNameHints(list, ["management", "business", "commerce", "mba", "bba", "economics"])
      : /\b(mechanical|mech|automobile|auto)\b/.test(t)
        ? byNameHints(list, ["mechanical", "automobile", "tech", "engineering"])
        : /\b(ai|machine learning|ml|data science|artificial)\b/.test(t)
          ? byNameHints(list, ["technology", "science", "tech", "data", "information", "iit"])
          : byNameHints(list, ["computer", "technology", "tech", "science", "information", "iit", "engineering"]);
    const label = /\b(business|mba|bba)\b/.test(t)
      ? "Business / management"
      : /\b(mechanical|mech)\b/.test(t)
        ? "Mechanical / engineering"
        : /\b(ai|ml|data)\b/.test(t)
          ? "AI / data-heavy fields"
          : "Computer / software";
    return {
      segments: [
        { type: "text", text: `Based on your interest, ${label} paths often align with these institutions in the list:` },
        { type: "colleges", colleges: picks },
      ],
    };
  }

  const tl = t.replace(/[^a-z0-9\s]/g, " ");
  let best = null;
  let bestLen = 0;
  const byLongestName = [...list].sort((a, b) => String(b.name || "").length - String(a.name || "").length);
  for (const c of byLongestName) {
    const nm = norm(c.name);
    if (nm.length < 4) continue;
    if (tl.includes(nm) && nm.length > bestLen) {
      best = c;
      bestLen = nm.length;
    }
  }

  if (
    best &&
    (t.includes("tell me about") ||
      t.includes("about ") ||
      t.includes("info on") ||
      t.includes("details on") ||
      bestLen >= 8)
  ) {
    const href = getCollegeWebsiteUrl(best);
    return {
      segments: [
        {
          type: "text",
          text: `${best.name}\nLocation: ${best.location}\nFees: ₹${best.fees}\nRating: ${best.rating}\nPlacement: ${best.placement}%`,
        },
        href ? { type: "link", href, linkLabel: "Visit website" } : { type: "text", text: "No direct website on record—search the official site from the college name." },
      ],
    };
  }

  return {
    segments: [
      {
        type: "text",
        text: "Try: “I like coding”, “My rank is 3000”, or “Tell me about IIT Delhi”. Use quick actions below.",
      },
    ],
  };
}
