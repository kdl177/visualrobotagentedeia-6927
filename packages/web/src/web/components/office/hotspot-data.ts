import * as THREE from "three";

export interface HotspotData {
  id: string;
  title: string;
  body: string;
  /** Punto 3D al que se ancla la etiqueta. */
  position: [number, number, number];
}

export const hotspots: HotspotData[] = [
  {
    id: "monitor",
    title: "Panel de trabajo",
    body: "Aquí el agente ejecuta tareas y te deja los resultados a la vista.",
    position: [-1.45, 3.15, -3.4],
  },
  {
    id: "board",
    title: "Memoria",
    body: "Notas, contexto y decisiones que el agente recuerda entre sesiones.",
    position: [0.7, 3.8, -4.5],
  },
  {
    id: "rack",
    title: "Procesos",
    body: "Automatizaciones corriendo en segundo plano, 24/7.",
    position: [-4.0, 2.8, -1.2],
  },
];

/** Encuadres de cámara: posición + punto de mira por vista. */
export const views: Record<string, { pos: THREE.Vector3; target: THREE.Vector3 }> = {
  default: { pos: new THREE.Vector3(7.6, 5.4, 9), target: new THREE.Vector3(-0.3, 1.4, -0.8) },
  monitor: { pos: new THREE.Vector3(2.2, 3.4, 3.4), target: new THREE.Vector3(-1.4, 2.2, -3.2) },
  board: { pos: new THREE.Vector3(3.2, 4, 3.4), target: new THREE.Vector3(0.7, 2.7, -4.2) },
  rack: { pos: new THREE.Vector3(1.2, 3.2, 3.6), target: new THREE.Vector3(-4, 1.7, -1.2) },
  agent: { pos: new THREE.Vector3(5.4, 2.8, 5.4), target: new THREE.Vector3(2.3, 1.5, 0.9) },
};

export const agentPosition: [number, number, number] = [2.5, 1.2, 1];
export const agentAnchor: [number, number, number] = [2.5, 2.75, 1];
