import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { palette, type AgentMood } from "../../lib/palette";
import { OfficeRoom } from "./office-room";
import { OfficeDesk } from "./office-desk";
import { DataMotes, Plant, ServerRack, Shelf, Whiteboard } from "./office-props";
import { AiAgent } from "./ai-agent";
import { agentAnchor, agentPosition, hotspots, views } from "./hotspot-data";
import { Projector, type Anchor, type AnchorRefs } from "./projector";

function CameraRig({ focus, camKey }: { focus: string | null; camKey: number }) {
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const { camera } = useThree();
  const animating = useRef(false);

  // `camKey` cambia en cada petición de encuadre, aunque el foco sea el mismo,
  // para que "Vista general" funcione también cuando ya no hay foco activo.
  useEffect(() => {
    animating.current = true;
    // Los controles se apagan durante el vuelo: su `update()` con damping
    // reescribía la posición de la cámara y peleaba con la interpolación.
    if (controls.current) controls.current.enabled = false;
  }, [focus, camKey]);

  const land = () => {
    const c = controls.current;
    if (!c) return;
    animating.current = false;
    // Un update sin damping limpia el momento residual del arrastre anterior.
    c.enableDamping = false;
    c.enabled = true;
    c.update();
    c.enableDamping = true;
  };

  useFrame((_, rawDelta) => {
    const c = controls.current;
    if (!animating.current || !c) return;
    const delta = Math.min(rawDelta, 1 / 20);
    const view = views[focus ?? "default"] ?? views.default!;
    const k = 1 - Math.pow(0.0015, delta);
    camera.position.lerp(view.pos, k);
    c.target.lerp(view.target, k);
    camera.lookAt(c.target);
    // Se detiene solo cuando la posición Y el punto de mira han llegado.
    if (
      camera.position.distanceTo(view.pos) < 0.04 &&
      c.target.distanceTo(view.target) < 0.04
    ) {
      camera.position.copy(view.pos);
      c.target.copy(view.target);
      camera.lookAt(c.target);
      land();
    }
  });

  return (
    <OrbitControls
      ref={controls}
      target={[-0.3, 1.4, -0.8]}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      minDistance={4.5}
      maxDistance={20}
      minPolarAngle={0.35}
      maxPolarAngle={1.45}
      onStart={() => {
        animating.current = false;
      }}
    />
  );
}

interface SceneProps {
  mood: AgentMood;
  focus: string | null;
  camKey: number;
  onPoke: () => void;
  anchorRefs: { current: AnchorRefs };
}

export function OfficeScene({ mood, focus, camKey, onPoke, anchorRefs }: SceneProps) {
  const anchors = useMemo<Anchor[]>(
    () => [
      { id: "bubble", position: agentAnchor, float: true, align: "bottom" as const },
      ...hotspots.map((h) => ({ id: h.id, position: h.position })),
    ],
    [],
  );

  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={[1, 2]} camera={{ position: [7.6, 5.4, 9], fov: 38 }} gl={{ antialias: true }}>
      <color attach="background" args={[palette.night]} />
      <fog attach="fog" args={[palette.night, 22, 40]} />

      {/* Luz */}
      <hemisphereLight args={[palette.sky, palette.wood, 0.7]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[-7, 8, 6]}
        intensity={2.1}
        color={palette.amber}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
      >
        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10, 0.1, 40]} />
      </directionalLight>
      <directionalLight position={[6, 5, 8]} intensity={0.55} color={palette.sky} />
      {/* Relleno para que las paredes en sombra no se apaguen */}
      <pointLight position={[-3.2, 3.4, 2.4]} intensity={18} distance={12} decay={2} color={palette.amber} />
      <pointLight position={[2.4, 4.2, -2]} intensity={14} distance={12} decay={2} color={palette.sky} />

      <Suspense fallback={null}>
        <OfficeRoom />
        <OfficeDesk />
        <Whiteboard position={[0.7, 2.6, -4.72]} />
        <ServerRack position={[-4.1, 0, -1.2]} />
        <Shelf position={[3.95, 0, -0.9]} rotation={-0.6} />
        <Plant position={[4.3, 0, 1.9]} scale={1.15} />
        <Plant position={[-3.4, 0, 2.9]} scale={0.9} />
        <DataMotes />
        <AiAgent mood={mood} onPoke={onPoke} position={agentPosition} />

        <ContactShadows
          position={[0, 0.03, 0]}
          opacity={0.45}
          scale={18}
          blur={2.6}
          far={5}
          color={palette.night}
        />
      </Suspense>

      <Projector anchors={anchors} refs={anchorRefs} />
      <CameraRig focus={focus} camKey={camKey} />
    </Canvas>
  );
}
