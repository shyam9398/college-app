/** Parse fee field from API (number, string with commas/₹, or "5L" / "5 lac"). Returns rupees or NaN. */
export function parseFeeRupees(fees) {
  if (fees == null || fees === "") return NaN;
  if (typeof fees === "number" && Number.isFinite(fees)) return fees;
  let s = String(fees).trim().toLowerCase().replace(/[,₹\s]/g, "");
  if (!s) return NaN;
  if (/lac|lakh/.test(s)) {
    const n = parseFloat(s.replace(/lac|lakhs?|l/g, ""));
    return Number.isFinite(n) ? n * 100000 : NaN;
  }
  if (/^[0-9.]+l$/.test(s)) {
    const n = parseFloat(s.slice(0, -1));
    return Number.isFinite(n) ? n * 100000 : NaN;
  }
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : NaN;
}
