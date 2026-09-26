import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { palette } from "../../lib/palette";

/** Planta cartoon en maceta. */
export function Plant({ position = [0, 0, 0] as [number, number, number], scale = 1 }) {
  const leaves = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (leaves.current) leaves.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
  });
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.24, 0.6, 16]} />
        <meshStandardMaterial color={palette.coral} roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.08, 16]} />
        <meshStandardMaterial color={palette.woodDark} roughness={0.8} />
      </mesh>
      <group ref={leaves} position={[0, 0.66, 0]}>
        {[
          [0, 0.55, 0, 0, 0],
          [0.28, 0.42, 0.1, 0, 0.5],
          [-0.26, 0.45, -0.1, 0, -0.5],
          [0.05, 0.38, 0.3, 0.5, 0],
          [-0.08, 0.35, -0.3, -0.5, 0],
        ].map(([x, y, z, rx, rz], i) => (
          <mesh key={i} position={[x!, y!, z!]} rotation={[rx!, 0, rz!]} castShadow>
            <sphereGeometry args={[0.28, 14, 10]} />
            <meshStandardMaterial color={i % 2 ? palette.leaf : "#58C98A"} roughness={0.85} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Rack de servidor con LEDs animados: "los procesos" del agente. */
export function ServerRack({ position = [0, 0, 0] as [number, number, number] }) {
  const leds = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    leds.current?.children.forEach((led, i) => {
      const m = (led as THREE.Mesh).material as THREE.MeshBasicMaterial;
      m.opacity = 0.35 + (Math.sin(t * 3 + i * 1.7) * 0.5 + 0.5) * 0.65;
    });
  });
  return (
    <group position={position}>
      <RoundedBox args={[1.1, 2.4, 0.9]} radius={0.08} smoothness={4} position={[0, 1.2, 0]} castShadow>
        <meshStandardMaterial color={palette.navy} roughness={0.5} metalness={0.25} />
      </RoundedBox>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[0, 0.35 + i * 0.35, 0.46]}>
          <boxGeometry args={[0.95, 0.24, 0.04]} />
          <meshStandardMaterial color={palette.night} roughness={0.4} />
        </mesh>
      ))}
      <group ref={leds}>
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} position={[-0.32 + (i % 2) * 0.14, 0.35 + Math.floor(i / 2) * 0.35, 0.49]}>
            <circleGeometry args={[0.035, 12]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? palette.coral : palette.mint}
              transparent
              opacity={0.8}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
      <pointLight position={[0, 1.2, 0.8]} color={palette.mint} intensity={1.1} distance={2.6} />
    </group>
  );
}

/** Pizarra con notas: la "memoria" del agente. */
export function Whiteboard({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[3, 1.9, 0.12]} />
        <meshStandardMaterial color={palette.white} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.07]}>
        <planeGeometry args={[2.82, 1.72]} />
        <meshStandardMaterial color="#FBFDFF" roughness={0.3} />
      </mesh>
      {[
        [-0.85, 0.42, palette.amber],
        [0, 0.42, palette.mint],
        [0.85, 0.42, palette.sky],
        [-0.42, -0.3, palette.coral],
        [0.42, -0.3, palette.plum],
      ].map(([x, y, c], i) => (
        <mesh key={i} position={[x as number, y as number, 0.09]} rotation={[0, 0, (i % 2 ? 1 : -1) * 0.05]}>
          <planeGeometry args={[0.62, 0.52]} />
          <meshBasicMaterial color={c as string} toneMapped={false} />
        </mesh>
      ))}
      {/* Marco inferior */}
      <mesh position={[0, -1.02, 0.08]}>
        <boxGeometry args={[3, 0.12, 0.2]} />
        <meshStandardMaterial color={palette.navy} />
      </mesh>
    </group>
  );
}

/** Estantería baja con cajas de colores. */
export function Shelf({ position = [0, 0, 0] as [number, number, number], rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <RoundedBox args={[2.6, 1.2, 0.6]} radius={0.05} smoothness={3} position={[0, 0.6, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={palette.wood} roughness={0.85} />
      </RoundedBox>
      <mesh position={[0, 0.6, 0.02]}>
        <boxGeometry args={[2.45, 0.06, 0.58]} />
        <meshStandardMaterial color={palette.woodDark} />
      </mesh>
      {/* Cajas archivadoras dentro del hueco */}
      {[
        [-0.75, 0.3, palette.coral],
        [-0.25, 0.3, palette.mint],
        [0.28, 0.3, palette.plum],
        [0.78, 0.3, palette.amber],
      ].map(([x, y, c], i) => (
        <mesh key={i} position={[x as number, y as number, 0.12]} castShadow>
          <boxGeometry args={[0.42, 0.4, 0.42]} />
          <meshStandardMaterial color={c as string} roughness={0.8} />
        </mesh>
      ))}
      {/* Carpetas apoyadas encima */}
      {[palette.sky, palette.amber, palette.coral].map((c, i) => (
        <mesh
          key={c}
          position={[0.55 + i * 0.1, 1.32, 0]}
          rotation={[0, 0, 0.14 + i * 0.05]}
          castShadow
        >
          <boxGeometry args={[0.1, 0.42, 0.34]} />
          <meshStandardMaterial color={c} roughness={0.8} />
        </mesh>
      ))}
      {/* Planta encima */}
      <group position={[-0.9, 1.2, 0]} scale={0.55}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.18, 0.4, 12]} />
          <meshStandardMaterial color={palette.white} />
        </mesh>
        <mesh position={[0, 0.55, 0]} castShadow>
          <sphereGeometry args={[0.3, 12, 10]} />
          <meshStandardMaterial color={palette.leaf} flatShading />
        </mesh>
      </group>
    </group>
  );
}

/** Hologramas de datos flotando: adorno sci-fi suave. */
export function DataMotes() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current?.children.forEach((m, i) => {
      m.position.y = 1.4 + Math.sin(t * 0.8 + i) * 0.35;
      m.rotation.y = t * 0.4 + i;
    });
  });
  return (
    <group ref={group}>
      {[
        [2.9, 0, -1.4],
        [3.4, 0, 1.2],
        [-3.1, 0, 2.6],
        [0.4, 0, 2.9],
      ].map(([x, , z], i) => (
        <mesh key={i} position={[x!, 1.4, z!]}>
          <octahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial
            color={i % 2 ? palette.plum : palette.mint}
            emissive={new THREE.Color(i % 2 ? palette.plum : palette.mint)}
            emissiveIntensity={1.6}
            transparent
            opacity={0.85}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
