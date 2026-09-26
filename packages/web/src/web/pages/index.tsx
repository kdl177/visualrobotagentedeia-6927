import { useCallback, useEffect, useRef, useState } from "react";
import { OfficeScene } from "../components/office/office-scene";
import { hotspots } from "../components/office/hotspot-data";
import { SceneOverlay } from "../components/office/scene-overlay";
import { SceneBoundary } from "../components/office/scene-boundary";
import { AgentHud } from "../components/hud/agent-hud";
import { useAgentState } from "../hooks/use-agent-state";
import { readEmbedConfig } from "../lib/embed-config";
import type { AnchorRefs } from "../components/office/projector";

function Index() {
  const agent = useAgentState();
  const [ready, setReady] = useState(false);
  const anchorRefs = useRef<AnchorRefs>({});
  const [config] = useState(() =>
    readEmbedConfig(typeof window === "undefined" ? "" : window.location.search),
  );
  // Se incrementa en cada petición de encuadre para forzar la animación de
  // cámara incluso cuando el foco no cambia (p. ej. "Vista general" dos veces).
  const [camKey, setCamKey] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(t);
  }, []);

  const goTo = useCallback(
    (next: string | null) => {
      agent.setFocus(next);
      setCamKey((k) => k + 1);
    },
    [agent],
  );

  const onHotspot = useCallback(
    (id: string) => {
      if (agent.focus === id) {
        goTo(null);
        return;
      }
      goTo(id);
      const spot = hotspots.find((h) => h.id === id);
      if (spot) agent.say(spot.body);
    },
    [agent, goTo],
  );

  return (
    <main
      className={`stage ${config.embed ? "stage--embed" : ""}`}
      style={{ ["--accent-brand" as string]: config.accent }}
    >
      <div className="stage__canvas">
        <SceneBoundary>
          <OfficeScene
            mood={agent.mood}
            focus={agent.focus}
            camKey={camKey}
            onPoke={agent.poke}
            anchorRefs={anchorRefs}
          />
        </SceneBoundary>
      </div>

      <SceneOverlay
        hotspots={config.labels ? hotspots : []}
        focus={agent.focus}
        mood={agent.mood}
        bubble={agent.bubble}
        onHotspot={onHotspot}
        refs={anchorRefs}
      />

      <div className={`stage__hud ${ready ? "is-ready" : ""}`}>
        <AgentHud
          name={config.name}
          tagline={config.tagline}
          accent={config.accent}
          showChat={config.chat}
          compact={config.embed}
          mood={agent.mood}
          messages={agent.messages}
          onSend={agent.send}
          onMood={agent.setMood}
          onReset={() => goTo(null)}
          onFocusAgent={() => goTo("agent")}
        />
      </div>

      <div className="vignette" />
    </main>
  );
}

export default Index;
