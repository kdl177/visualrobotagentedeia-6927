import { useEffect, useRef, useState } from "react";
import { moodColor, moodLabel, type AgentMood } from "../../lib/palette";
import type { ChatMessage } from "../../hooks/use-agent-state";

const moods: AgentMood[] = ["idle", "thinking", "talking", "working"];

const quickPrompts = [
  "Resume mis correos",
  "Prepara el informe",
  "Organiza mi agenda",
];

interface HudProps {
  name: string;
  tagline: string;
  accent: string;
  showChat: boolean;
  compact: boolean;
  mood: AgentMood;
  messages: ChatMessage[];
  onSend: (text: string) => void;
  onMood: (mood: AgentMood) => void;
  onReset: () => void;
  onFocusAgent: () => void;
}

export function AgentHud({
  name,
  tagline,
  accent,
  showChat,
  compact,
  mood,
  messages,
  onSend,
  onMood,
  onReset,
  onFocusAgent,
}: HudProps) {
  const [value, setValue] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const submit = (text: string) => {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setValue("");
  };

  return (
    <>
      {/* Header */}
      <header className="hud hud--top">
        <div className="brand">
          <span className="brand__mark" style={{ background: accent }} />
          <div>
            <p className="brand__name">{name}</p>
            <p className="brand__sub">{tagline}</p>
          </div>
        </div>
        <div className="status" style={{ ["--dot" as string]: moodColor[mood] }}>
          <span className="status__dot" />
          {moodLabel[mood]}
        </div>
      </header>

      {/* Panel de chat */}
      {showChat ? (
        <aside className="hud hud--chat">
          <div className="chat__head">
            <span>Conversación</span>
            <button type="button" className="chat__ghost" onClick={onFocusAgent}>
              Ver al agente
            </button>
          </div>
          <div className="chat__list" ref={listRef}>
            {messages.map((m) => (
              <div key={m.id} className={`msg msg--${m.from}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="chat__quick">
            {quickPrompts.map((q) => (
              <button key={q} type="button" onClick={() => submit(q)}>
                {q}
              </button>
            ))}
          </div>
          <form
            className="chat__form"
            onSubmit={(e) => {
              e.preventDefault();
              submit(value);
            }}
          >
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Pide algo a tu agente…"
              aria-label="Mensaje para el agente"
            />
            <button type="submit" aria-label="Enviar">
              →
            </button>
          </form>
        </aside>
      ) : null}

      {/* Barra de estados */}
      <footer className="hud hud--bottom">
        <div className="moodbar">
          {moods.map((m) => (
            <button
              key={m}
              type="button"
              className={`moodbar__btn ${mood === m ? "is-active" : ""}`}
              style={{ ["--c" as string]: moodColor[m] }}
              onClick={() => onMood(m)}
            >
              {moodLabel[m]}
            </button>
          ))}
        </div>
        <div className="hint">
          {compact ? null : (
            <span>Arrastra para orbitar · rueda para zoom · clic en el agente</span>
          )}
          <button type="button" onClick={onReset}>
            Vista general
          </button>
        </div>
      </footer>
    </>
  );
}
