import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { palette } from "../../lib/palette";

/** Escritorio con monitor emisivo, teclado, taza, silla y lámpara. */
export function OfficeDesk() {
  const screen = useRef<THREE.MeshStandardMaterial>(null);
  const bars = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (screen.current) screen.current.emissiveIntensity = 1.1 + Math.sin(t * 2) * 0.18;
    if (bars.current) {
      bars.current.children.forEach((child, i) => {
        const h = 0.3 + (Math.sin(t * 1.6 + i) * 0.5 + 0.5) * 0.7;
        child.scale.y = h;
        child.position.y = -0.32 + (h * 0.5) / 1;
      });
    }
  });

  return (
    <group position={[-1.6, 0, -3.1]}>
      {/* Tablero */}
      <RoundedBox args={[3.4, 0.14, 1.5]} radius={0.06} smoothness={4} position={[0, 1.02, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={palette.cream} roughness={0.6} />
      </RoundedBox>
      {/* Patas */}
      {[
        [-1.5, -0.6],
        [1.5, -0.6],
        [-1.5, 0.6],
        [1.5, 0.6],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x!, 0.5, z!]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 1, 10]} />
          <meshStandardMaterial color={palette.navy} roughness={0.5} metalness={0.2} />
        </mesh>
      ))}

      {/* Monitor */}
      <group position={[0.15, 1.09, -0.35]}>
        <mesh position={[0, 0.06, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.34, 0.07, 18]} />
          <meshStandardMaterial color={palette.navy} metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.12, 0.7, 0.12]} />
          <meshStandardMaterial color={palette.navy} metalness={0.3} roughness={0.4} />
        </mesh>
        <RoundedBox args={[2.1, 1.25, 0.1]} radius={0.06} smoothness={4} position={[0, 1.15, 0]} castShadow>
          <meshStandardMaterial color={palette.navy} roughness={0.5} />
        </RoundedBox>
        {/* Pantalla */}
        <mesh position={[0, 1.15, 0.06]}>
          <planeGeometry args={[1.94, 1.1]} />
          <meshStandardMaterial
            ref={screen}
            color={palette.night}
            emissive={new THREE.Color(palette.sky)}
            emissiveIntensity={1.1}
            toneMapped={false}
          />
        </mesh>
        {/* "Dashboard" en pantalla */}
        <group ref={bars} position={[-0.55, 1.05, 0.08]}>
          {Array.from({ length: 6 }).map((_, i) => (
            <mesh key={i} position={[i * 0.2, 0, 0]}>
              <planeGeometry args={[0.11, 1]} />
              <meshBasicMaterial color={i % 2 ? palette.mint : palette.coral} toneMapped={false} />
            </mesh>
          ))}
        </group>
        {Array.from({ length: 3 }).map((_, i) => (
          <mesh key={i} position={[0.6, 1.42 - i * 0.16, 0.08]}>
            <planeGeometry args={[0.7 - i * 0.12, 0.06]} />
            <meshBasicMaterial color={palette.white} transparent opacity={0.75} toneMapped={false} />
          </mesh>
        ))}
        <pointLight position={[0, 1.15, 0.9]} color={palette.sky} intensity={2.4} distance={4} />
      </group>

      {/* Teclado y ratón */}
      <RoundedBox args={[1.1, 0.06, 0.38]} radius={0.03} smoothness={3} position={[0.1, 1.12, 0.36]} castShadow>
        <meshStandardMaterial color={palette.white} roughness={0.6} />
      </RoundedBox>
      <mesh position={[0.95, 1.13, 0.36]} castShadow>
        <sphereGeometry args={[0.1, 16, 12]} />
        <meshStandardMaterial color={palette.white} roughness={0.5} />
      </mesh>

      {/* Taza */}
      <group position={[-1.25, 1.2, 0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.14, 0.12, 0.26, 16]} />
          <meshStandardMaterial color={palette.coral} roughness={0.5} />
        </mesh>
        <mesh position={[0.17, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.08, 0.025, 8, 20]} />
          <meshStandardMaterial color={palette.coral} roughness={0.5} />
        </mesh>
      </group>

      {/* Libros apilados */}
      {[palette.plum, palette.mint, palette.amber].map((c, i) => (
        <mesh key={c} position={[-1.35, 1.15 + i * 0.11, -0.35]} rotation={[0, i * 0.1, 0]} castShadow>
          <boxGeometry args={[0.55, 0.1, 0.4]} />
          <meshStandardMaterial color={c} roughness={0.8} />
        </mesh>
      ))}

      {/* Lámpara de escritorio */}
      <group position={[1.45, 1.1, -0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.18, 0.06, 14]} />
          <meshStandardMaterial color={palette.navy} />
        </mesh>
        <mesh position={[0, 0.35, 0.05]} rotation={[0.25, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.7, 8]} />
          <meshStandardMaterial color={palette.navy} />
        </mesh>
        <mesh position={[0, 0.72, 0.2]} rotation={[1.1, 0, 0]} castShadow>
          <coneGeometry args={[0.2, 0.28, 16, 1, true]} />
          <meshStandardMaterial color={palette.amber} side={THREE.DoubleSide} roughness={0.5} />
        </mesh>
        <pointLight position={[0, 0.6, 0.35]} color={palette.amber} intensity={3} distance={3.4} />
      </group>

      {/* Silla */}
      <group position={[0.2, 0, 1.5]} rotation={[0, Math.PI, 0]}>
        <RoundedBox args={[0.85, 0.14, 0.8]} radius={0.06} smoothness={4} position={[0, 0.58, 0]} castShadow>
          <meshStandardMaterial color={palette.coral} roughness={0.7} />
        </RoundedBox>
        <RoundedBox args={[0.85, 0.9, 0.14]} radius={0.07} smoothness={4} position={[0, 1.02, -0.35]} rotation={[-0.14, 0, 0]} castShadow>
          <meshStandardMaterial color={palette.coral} roughness={0.7} />
        </RoundedBox>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.5, 10]} />
          <meshStandardMaterial color={palette.navy} metalness={0.3} />
        </mesh>
        {Array.from({ length: 5 }).map((_, i) => {
          const a = (i / 5) * Math.PI * 2;
          return (
            <group key={i}>
              <mesh position={[Math.cos(a) * 0.22, 0.1, Math.sin(a) * 0.22]} rotation={[0, -a, 0]}>
                <boxGeometry args={[0.44, 0.06, 0.08]} />
                <meshStandardMaterial color={palette.navy} />
              </mesh>
              <mesh position={[Math.cos(a) * 0.42, 0.05, Math.sin(a) * 0.42]}>
                <sphereGeometry args={[0.06, 10, 10]} />
                <meshStandardMaterial color={palette.night} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}
