import { moodColor, type AgentMood } from "../../lib/palette";
import type { AnchorRefs } from "./projector";
import type { HotspotData } from "./hotspot-data";

interface OverlayProps {
  hotspots: HotspotData[];
  focus: string | null;
  mood: AgentMood;
  bubble: string;
  onHotspot: (id: string) => void;
  refs: { current: AnchorRefs };
}

/** Etiquetas y burbuja que viven en el DOM y las posiciona `Projector` frame a frame. */
export function SceneOverlay({ hotspots, focus, mood, bubble, onHotspot, refs }: OverlayProps) {
  return (
    <div className="overlay3d">
      <div
        className="overlay3d__node"
        ref={(el) => {
          refs.current.bubble = el;
        }}
      >
        <div className="agent-bubble" style={{ ["--bubble" as string]: moodColor[mood] }}>
          {bubble}
        </div>
      </div>

      {hotspots.map((h) => (
        <div
          key={h.id}
          className="overlay3d__node"
          ref={(el) => {
            refs.current[h.id] = el;
          }}
        >
          <button
            type="button"
            className={`hotspot ${focus === h.id ? "hotspot--active" : ""}`}
            onClick={() => onHotspot(h.id)}
          >
            <span className="hotspot__dot" />
            <span className="hotspot__label">{focus === h.id ? h.body : h.title}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
