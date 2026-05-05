import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildChatbotReply } from "../utils/chatbotEngine";
import { getCollegeWebsiteUrl } from "../utils/collegeWebsite";

const QUICK_ACTIONS = [
  { label: "Recommend by rank", text: "My rank is 4500. Recommend colleges." },
  { label: "What is CSE?", text: "What is CSE?" },
  { label: "Top colleges", text: "Show top colleges by rating." },
];

function SegmentsView({ segments, onPickCollege }) {
  return (
    <div className="chatbot-segments">
      {segments.map((seg, i) => {
        if (seg.type === "text") {
          return (
            <p key={i} className="chatbot-segments__text">
              {String(seg.text || "")
                .split("\n")
                .map((line, j) => (
                  <React.Fragment key={j}>
                    {j > 0 ? <br /> : null}
                    {line}
                  </React.Fragment>
                ))}
            </p>
          );
        }
        if (seg.type === "colleges" && seg.colleges?.length) {
          return (
            <div key={i} className="chatbot-chips">
              {seg.colleges.map((c) => (
                <button key={String(c.id)} type="button" className="chatbot-chip" onClick={() => onPickCollege(c)}>
                  {c.name}
                </button>
              ))}
            </div>
          );
        }
        if (seg.type === "link" && seg.href) {
          return (
            <a key={i} className="chatbot-link btn btn-primary" href={seg.href} target="_blank" rel="noopener noreferrer">
              {seg.linkLabel || "Visit website"}
            </a>
          );
        }
        return null;
      })}
    </div>
  );
}

function Chatbot({ colleges, onSelectCollege, activeCollege }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(() => [
    {
      id: "welcome",
      role: "bot",
      segments: [{ type: "text", text: "Hi! I can help with colleges, courses, and rank-based suggestions." }],
    },
  ]);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const collegeList = useMemo(() => (Array.isArray(colleges) ? colleges : []), [colleges]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open]);

  const sendText = useCallback(
    async (text) => {
      const clean = String(text || "").trim();
      if (!clean || loading) return;
      setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", segments: [{ type: "text", text: clean }] }]);
      setInput("");
      setLoading(true);
      try {
        const reply = await buildChatbotReply(clean, collegeList);
        setMessages((prev) => [...prev, { id: `b-${Date.now()}`, role: "bot", segments: reply.segments || [] }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { id: `b-err-${Date.now()}`, role: "bot", segments: [{ type: "text", text: "Please try again in a moment." }] },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [collegeList, loading]
  );

  const pickCollege = useCallback(
    (college) => {
      if (typeof onSelectCollege === "function") onSelectCollege(college);
      setOpen(false);
    },
    [onSelectCollege]
  );

  return (
    <div className="chatbot-widget">
      {open && (
        <div className="chatbot-panel" id="chatbot-panel" role="dialog" aria-labelledby="chatbot-title">
          <div className="chatbot-panel__head">
            <div>
              <div id="chatbot-title" className="chatbot-panel__title">
                Decision Assistant
              </div>
              <div className="chatbot-panel__subtitle">Education guidance only</div>
            </div>
            <button type="button" className="chatbot-panel__close" onClick={() => setOpen(false)} aria-label="Close chatbot">
              ×
            </button>
          </div>
          <div className="chatbot-quick">
            {QUICK_ACTIONS.map((q) => (
              <button key={q.label} type="button" className="chatbot-quick__btn" onClick={() => sendText(q.text)} disabled={loading}>
                {q.label}
              </button>
            ))}
          </div>
          <div className="chatbot-messages">
            {messages.map((m) => (
              <div key={m.id} className={`chatbot-bubble chatbot-bubble--${m.role}`}>
                {m.role === "user" ? m.segments?.[0]?.text : <SegmentsView segments={m.segments || []} onPickCollege={pickCollege} />}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="chatbot-form">
            <input
              ref={inputRef}
              className="input-rounded chatbot-form__input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendText(input);
              }}
              placeholder="Ask about colleges, courses, rank..."
            />
            <button type="button" className="btn btn-primary chatbot-form__send" onClick={() => sendText(input)} disabled={loading}>
              {loading ? "..." : "Send"}
            </button>
          </div>
          {activeCollege ? (
            <div className="chatbot-context">
              Official link:{" "}
              <a className="chatbot-context__link" href={getCollegeWebsiteUrl(activeCollege)} target="_blank" rel="noopener noreferrer">
                {activeCollege.name}
              </a>
            </div>
          ) : null}
        </div>
      )}
      <button
        type="button"
        className={`chatbot-fab ${open ? "chatbot-fab--open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={open ? "chatbot-panel" : undefined}
        aria-label={open ? "Close decision assistant" : "Open decision assistant"}
      >
        {open ? (
          "×"
        ) : (
          <span className="chatbot-fab__icon-wrap" aria-hidden="true">
            <span className="chatbot-fab__robot">🤖</span>
            <span className="chatbot-fab__cap">🎓</span>
          </span>
        )}
      </button>
    </div>
  );
}

export default React.memo(Chatbot);