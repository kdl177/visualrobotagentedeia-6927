import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export interface Anchor {
  id: string;
  position: [number, number, number];
  /** Oscila con la flotación del agente. */
  float?: boolean;
  /** "bottom" coloca el nodo justo encima del punto; por defecto va centrado. */
  align?: "center" | "bottom";
}

export type AnchorRefs = Record<string, HTMLElement | null>;

interface ProjectorProps {
  anchors: Anchor[];
  refs: { current: AnchorRefs };
}

const v = new THREE.Vector3();

/**
 * Proyecta posiciones 3D a coordenadas de pantalla y mueve los nodos DOM del overlay
 * escribiendo directamente en `style` (sin re-render de React).
 * Sustituye a `<Html>` de drei, que se desmonta de forma inestable bajo StrictMode.
 */
export function Projector({ anchors, refs }: ProjectorProps) {
  const { camera, size } = useThree();

  useFrame((state) => {
    for (const a of anchors) {
      const el = refs.current[a.id];
      if (!el) continue;
      const floatY = a.float ? Math.sin(state.clock.elapsedTime * 1.4) * 0.09 : 0;
      v.set(a.position[0], a.position[1] + floatY, a.position[2]);
      const dist = camera.position.distanceTo(v);
      v.project(camera);
      const behind = v.z > 1;
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      const scale = THREE.MathUtils.clamp(11 / dist, 0.62, 1.25);
      const shift = a.align === "bottom" ? "translate(-50%, -100%)" : "translate(-50%, -50%)";
      el.style.transform = `translate3d(${x}px, ${y}px, 0) ${shift} scale(${scale})`;
      el.style.opacity = behind ? "0" : "1";
      el.style.pointerEvents = behind ? "none" : "auto";
      el.style.zIndex = String(Math.round(1000 - dist * 10));
    }
  });

  return null;
}
