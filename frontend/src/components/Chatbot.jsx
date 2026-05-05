import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildChatbotReply } from "../utils/chatbotEngine";
import { getCollegeWebsiteUrl } from "../utils/collegeWebsite";

const QUICK_ACTIONS = [
  { label: "Recommend colleges", text: "Recommend colleges" },
  { label: "Best course for me", text: "Best course for me" },
  { label: "Search by rank", text: "Search by rank" },
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
  const [messages, setMessages] = useState(() => [
    {
      id: "w",
      role: "bot",
      segments: [
        {
          type: "text",
          text: "Hi—I can suggest colleges by interest, by rank, or answer about a specific college. Try the quick actions or type your question.",
        },
      ],
    },
  ]);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  const collegeList = useMemo(() => (Array.isArray(colleges) ? colleges : []), [colleges]);

  useEffect(() => {
    if (!open) return;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  const [loading, setLoading] = useState(false);

  const sendText = useCallback(async (raw) => {
    const text = String(raw || "").trim();
    if (!text || loading) return;
    
    const userId = `u-${Date.now()}`;
    setMessages((m) => [...m, { id: userId, role: "user", segments: [{ type: "text", text }] }]);
    setInput("");
    setLoading(true);

    try {
      const botReply = await buildChatbotReply(text, collegeList);
      setMessages((m) => [...m, { id: `b-${Date.now()}`, role: "bot", segments: botReply.segments }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((m) => [...m, { 
        id: `b-error-${Date.now()}`, 
        role: "bot", 
        segments: [{ type: "text", text: "Sorry, try again. Service temporarily unavailable." }] 
      }]);
    } finally {
      setLoading(false);
    }
  }, [collegeList, loading]);

  const send = useCallback(() => {
    sendText(input);
  }, [input, sendText]);


  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const pickCollege = useCallback(
    (c) => {
      onSelectCollege(c);
      setOpen(false);
    },
    [onSelectCollege]
  );

  return (
    <div className="chatbot-widget">
      {open && (
        <div className="chatbot-panel" id="chatbot-panel" role="dialog" aria-labelledby="chatbot-title" aria-modal="false">
          <div className="chatbot-panel__head">
            <div>
              <div id="chatbot-title" className="chatbot-panel__title">
                Decision assistant
              </div>
              <div className="chatbot-panel__subtitle">Education-only guidance: interest · rank · college lookup</div>
            </div>
            <button type="button" className="chatbot-panel__close" onClick={() => setOpen(false)} aria-label="Close chat">
              ×
            </button>
          </div>
          <div className="chatbot-quick">
            {QUICK_ACTIONS.map(({ label, text }, i) => (
              <button 
                key={i}
                type="button" 
                className="chatbot-quick__btn" 
                onClick={() => sendText(text)}
                disabled={loading}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="chatbot-messages" role="log" aria-live="polite">
            {messages.map((msg) => (
              <div key={msg.id} className={`chatbot-bubble chatbot-bubble--${msg.role}`}>
                {msg.role === "user" ? (
                  msg.segments?.[0]?.text
                ) : (
                  <SegmentsView segments={msg.segments || []} onPickCollege={pickCollege} />
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="chatbot-form">
            <input
              ref={inputRef}
              type="text"
              className="input-rounded chatbot-form__input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="e.g. I like AI, or my rank is 4000…"
              aria-label="Message"
              maxLength={500}
            />
            <button type="button" className="btn btn-primary chatbot-form__send" onClick={send} disabled={loading}>
              {loading ? "..." : "Send"}
            </button>

          </div>
          {activeCollege && (
            <div className="chatbot-context">
              On details:{" "}
              <a href={getCollegeWebsiteUrl(activeCollege)} target="_blank" rel="noopener noreferrer" className="chatbot-context__link">
                Visit {activeCollege.name} website
              </a>
            </div>
          )}
        </div>
      )}
      <button
        type="button"
        className={`chatbot-fab ${open ? "chatbot-fab--open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={open ? "chatbot-panel" : undefined}
        aria-label={open ? "Close assistant" : "Open assistant"}
      >
        {open ? "×" : <span aria-hidden="true">💬</span>}
      </button>
    </div>
  );
}

export default React.memo(Chatbot);
