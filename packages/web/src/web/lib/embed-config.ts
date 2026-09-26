import { palette } from "./palette";

export interface EmbedConfig {
  /** Nombre visible del agente. */
  name: string;
  /** Subtítulo bajo el nombre. */
  tagline: string;
  /** Color de acento del HUD. */
  accent: string;
  /** Modo embed: oculta chat y pistas, deja solo la escena. */
  embed: boolean;
  /** Mostrar el panel de chat. */
  chat: boolean;
  /** Mostrar las etiquetas de la sala. */
  labels: boolean;
}

/**
 * Configuración leída de la query string, para poder incrustar la escena
 * en otra web sin recompilar:
 * `?name=NOVA&tagline=Tu%20copiloto&accent=%2335E0AE&embed=1&chat=0&labels=0`
 */
export function readEmbedConfig(search: string): EmbedConfig {
  const q = new URLSearchParams(search);
  const flag = (key: string, fallback: boolean) => {
    const v = q.get(key);
    if (v === null) return fallback;
    return v !== "0" && v !== "false";
  };
  const embed = flag("embed", false);
  const accent = q.get("accent");

  return {
    name: q.get("name") ?? "NOVA",
    tagline: q.get("tagline") ?? "Oficina virtual privada",
    accent: accent && /^#?[0-9a-fA-F]{6}$/.test(accent) ? (accent.startsWith("#") ? accent : `#${accent}`) : palette.mint,
    embed,
    chat: flag("chat", !embed),
    labels: flag("labels", true),
  };
}
