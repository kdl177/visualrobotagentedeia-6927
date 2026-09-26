// Única fuente de verdad de color para la escena 3D (ver design.md).
export const palette = {
  night: "#141A2E",
  navy: "#1E2A4A",
  navyLight: "#2C3A61",
  cream: "#F6EBDA",
  creamDark: "#E4D2BA",
  coral: "#FF6B4A",
  mint: "#35E0AE",
  sky: "#6EC6FF",
  amber: "#FFC15E",
  plum: "#7A5CFF",
  wood: "#C98A54",
  woodDark: "#9C6437",
  leaf: "#3FAE72",
  white: "#FFFFFF",
} as const;

export type AgentMood = "idle" | "thinking" | "talking" | "working";

export const moodColor: Record<AgentMood, string> = {
  idle: palette.mint,
  thinking: palette.plum,
  talking: palette.sky,
  working: palette.amber,
};

export const moodLabel: Record<AgentMood, string> = {
  idle: "En espera",
  thinking: "Pensando",
  talking: "Hablando",
  working: "Trabajando",
};
