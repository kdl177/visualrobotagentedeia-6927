import { useCallback, useEffect, useRef, useState } from "react";
import type { AgentMood } from "../lib/palette";

export interface ChatMessage {
  id: number;
  from: "agent" | "user";
  text: string;
}

const CANNED: string[] = [
  "Listo. He revisado tu bandeja y agrupado lo urgente en tres bloques.",
  "Tengo el informe montado. ¿Te lo dejo en la pizarra o lo exporto?",
  "He encontrado dos huecos en tu agenda del jueves. ¿Reservo uno?",
  "Los procesos del rack están al 34%. Todo estable por aquí.",
  "Puedo encadenar esa tarea con las anteriores y dejártela hecha por la noche.",
];

let nextId = 3;

export function useAgentState() {
  const [mood, setMood] = useState<AgentMood>("idle");
  const [bubble, setBubble] = useState<string>("¡Hola! Bienvenido a tu oficina.");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, from: "agent", text: "Bienvenido a tu oficina privada. Estoy operativo." },
    { id: 2, from: "agent", text: "Pídeme algo o toca un punto de la sala para ver qué hago." },
  ]);
  const [focus, setFocus] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      for (const t of timers.current) clearTimeout(t);
    };
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const say = useCallback(
    (text: string) => {
      setBubble(text);
      setMood("talking");
      setMessages((m) => [...m, { id: nextId++, from: "agent", text }]);
      later(() => setMood("idle"), 3200);
    },
    [later],
  );

  const send = useCallback(
    (text: string) => {
      setMessages((m) => [...m, { id: nextId++, from: "user", text }]);
      setMood("thinking");
      setBubble("Dame un segundo…");
      later(() => {
        setMood("working");
        setFocus("monitor");
      }, 900);
      later(() => {
        setFocus(null);
        say(CANNED[Math.floor(Math.random() * CANNED.length)] ?? CANNED[0]!);
      }, 2200);
    },
    [later, say],
  );

  const poke = useCallback(() => {
    const lines = [
      "¿Sí? Aquí estoy.",
      "Tu oficina está en orden.",
      "Puedo orbitar la sala contigo, sin marearme.",
    ];
    say(lines[Math.floor(Math.random() * lines.length)]!);
  }, [say]);

  return { mood, setMood, bubble, setBubble, messages, send, say, poke, focus, setFocus };
}
