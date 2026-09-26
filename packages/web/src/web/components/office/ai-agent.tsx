import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { moodColor, palette, type AgentMood } from "../../lib/palette";

interface AgentProps {
  mood: AgentMood;
  onPoke: () => void;
  position?: [number, number, number];
}

const speed: Record<AgentMood, number> = {
  idle: 1,
  thinking: 1.7,
  talking: 2.4,
  working: 3.4,
};

export function AiAgent({ mood, onPoke, position = [1.75, 1.2, 0.35] }: AgentProps) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const eyeL = useRef<THREE.Mesh>(null);
  const eyeR = useRef<THREE.Mesh>(null);
  const mouth = useRef<THREE.Mesh>(null);
  const handL = useRef<THREE.Group>(null);
  const handR = useRef<THREE.Group>(null);
  const glow = useRef<THREE.PointLight>(null);
  const core = useRef<THREE.Mesh>(null);
  const hovered = useRef(false);

  const color = moodColor[mood];
  const emissive = useMemo(() => new THREE.Color(color), [color]);

  useFrame((state, rawDelta) => {
    const t = state.clock.elapsedTime;
    const s = speed[mood];
    // Un frame largo (pestaña en segundo plano, pico de render) hacía que
    // `delta * k` pasara de 1 y el lerp se disparara: la cabeza acababa girada.
    const delta = Math.min(rawDelta, 1 / 20);
    const ease = (k: number) => 1 - Math.exp(-k * delta);

    // Flotación idle + respiración
    if (root.current) {
      root.current.position.y = position[1] + Math.sin(t * 1.4 * s) * 0.09;
      root.current.rotation.z = Math.sin(t * 0.9) * 0.03;
      const target = hovered.current ? 1.06 : 1;
      root.current.scale.lerp(new THREE.Vector3(target, target, target), ease(6));
    }

    // La cabeza sigue el cursor, con un sesgo según el estado
    if (head.current) {
      const lookUp = mood === "thinking" ? 0.14 : 0;
      const nod = mood === "talking" ? Math.sin(t * 7) * 0.05 : 0;
      const yawTarget = THREE.MathUtils.clamp(state.pointer.x * 0.45, -0.4, 0.4);
      const pitchTarget = THREE.MathUtils.clamp(
        -state.pointer.y * 0.16 - lookUp + nod,
        -0.2,
        0.16,
      );
      const k = ease(4);
      head.current.rotation.y = THREE.MathUtils.clamp(
        THREE.MathUtils.lerp(head.current.rotation.y, yawTarget, k),
        -0.4,
        0.4,
      );
      head.current.rotation.x = THREE.MathUtils.clamp(
        THREE.MathUtils.lerp(head.current.rotation.x, pitchTarget, k),
        -0.2,
        0.16,
      );
      head.current.rotation.z = 0;
    }

    // Anillos de energía
    if (ring.current) ring.current.rotation.z += delta * 0.9 * s;
    if (ring2.current) ring2.current.rotation.z -= delta * 1.4 * s;

    // Parpadeo
    const blink = Math.sin(t * 1.3) > 0.985 ? 0.12 : 1;
    const squint = mood === "thinking" ? 0.55 : 1;
    for (const e of [eyeL, eyeR]) {
      if (e.current) e.current.scale.y = THREE.MathUtils.lerp(e.current.scale.y, blink * squint, 0.4);
    }

    // Boca: habla cuando toca
    if (mouth.current) {
      const talk = mood === "talking" ? 0.5 + Math.abs(Math.sin(t * 12)) * 1.6 : 0.45;
      mouth.current.scale.y = THREE.MathUtils.lerp(mouth.current.scale.y, talk, 0.3);
    }

    // Manos flotantes
    if (handL.current && handR.current) {
      const amp = mood === "working" ? 0.26 : mood === "talking" ? 0.16 : 0.07;
      handL.current.position.y = Math.sin(t * 2.6 * s) * amp - 0.1;
      handR.current.position.y = Math.sin(t * 2.6 * s + Math.PI / 2) * amp - 0.1;
      handL.current.position.x = -0.78 - Math.sin(t * 1.7) * 0.05;
      handR.current.position.x = 0.78 + Math.sin(t * 1.7) * 0.05;
    }

    // Núcleo del pecho + luz
    const pulse = 1 + Math.sin(t * 3 * s) * 0.14;
    if (core.current) core.current.scale.setScalar(pulse);
    if (glow.current) glow.current.intensity = 2.2 + Math.sin(t * 3 * s) * 0.7;
  });

  return (
    <group
      ref={root}
      position={position}
      onPointerOver={() => {
        hovered.current = true;
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        hovered.current = false;
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onPoke();
      }}
    >
      {/* Cabeza */}
      <group ref={head} position={[0, 0.72, 0]}>
        <RoundedBox args={[1.02, 0.78, 0.8]} radius={0.3} smoothness={6} castShadow>
          <meshStandardMaterial color={palette.cream} roughness={0.55} metalness={0.05} />
        </RoundedBox>
        {/* Visor */}
        <RoundedBox args={[0.82, 0.42, 0.12]} radius={0.16} smoothness={5} position={[0, 0.04, 0.4]}>
          <meshStandardMaterial color={palette.night} roughness={0.25} metalness={0.3} />
        </RoundedBox>
        <mesh ref={eyeL} position={[-0.17, 0.06, 0.47]}>
          <capsuleGeometry args={[0.055, 0.06, 4, 12]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={2.4} toneMapped={false} />
        </mesh>
        <mesh ref={eyeR} position={[0.17, 0.06, 0.47]}>
          <capsuleGeometry args={[0.055, 0.06, 4, 12]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={2.4} toneMapped={false} />
        </mesh>
        {/* Boca */}
        <mesh ref={mouth} position={[0, -0.16, 0.43]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.04, 0.16, 4, 10]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
        {/* Auriculares */}
        {[-0.56, 0.56].map((x) => (
          <mesh key={x} position={[x, 0, 0]} castShadow>
            <sphereGeometry args={[0.16, 20, 20]} />
            <meshStandardMaterial color={palette.navy} roughness={0.4} />
          </mesh>
        ))}
        {/* Antena */}
        <mesh position={[0, 0.48, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.28, 8]} />
          <meshStandardMaterial color={palette.navy} />
        </mesh>
        <mesh position={[0, 0.66, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={2.6} toneMapped={false} />
        </mesh>
      </group>

      {/* Cuerpo */}
      <RoundedBox args={[0.82, 0.86, 0.66]} radius={0.28} smoothness={6} position={[0, -0.02, 0]} castShadow>
        <meshStandardMaterial color={palette.white} roughness={0.6} metalness={0.05} />
      </RoundedBox>
      {/* Núcleo del pecho */}
      <mesh ref={core} position={[0, 0.02, 0.35]}>
        <sphereGeometry args={[0.13, 20, 20]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={2.8} toneMapped={false} />
      </mesh>
      <pointLight ref={glow} position={[0, 0.1, 0.5]} color={color} intensity={2.2} distance={3.2} />

      {/* Manos flotantes */}
      <group ref={handL} position={[-0.78, -0.1, 0.05]}>
        <mesh castShadow>
          <sphereGeometry args={[0.15, 18, 18]} />
          <meshStandardMaterial color={palette.navy} roughness={0.45} />
        </mesh>
      </group>
      <group ref={handR} position={[0.78, -0.1, 0.05]}>
        <mesh castShadow>
          <sphereGeometry args={[0.15, 18, 18]} />
          <meshStandardMaterial color={palette.navy} roughness={0.45} />
        </mesh>
      </group>

      {/* Base antigravedad */}
      <mesh position={[0, -0.56, 0]}>
        <coneGeometry args={[0.34, 0.34, 16]} />
        <meshStandardMaterial color={palette.navy} roughness={0.4} flatShading />
      </mesh>
      <mesh ref={ring} position={[0, -0.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.46, 0.028, 10, 40]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <mesh ref={ring2} position={[0, -0.92, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.02, 10, 32]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      {/* Halo en el suelo */}
      <mesh position={[0, -1.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.62, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.16} toneMapped={false} />
      </mesh>
    </group>
  );
}
