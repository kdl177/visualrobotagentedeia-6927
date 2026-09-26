import { palette } from "../../lib/palette";

/** Sala cartoon: suelo, dos paredes, ventana con cielo, alfombra y cuadros. */
export function OfficeRoom() {
  return (
    <group>
      {/* Suelo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color={palette.wood} roughness={0.85} />
      </mesh>
      {/* Tarima clara */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.002, -5 + i * 1.6]}
          receiveShadow
        >
          <planeGeometry args={[13.8, 0.06]} />
          <meshStandardMaterial color={palette.woodDark} roughness={0.9} />
        </mesh>
      ))}

      {/* Pared trasera */}
      <mesh position={[0, 3, -5]} receiveShadow>
        <boxGeometry args={[14, 6, 0.3]} />
        <meshStandardMaterial color={palette.cream} roughness={0.95} />
      </mesh>
      {/* Pared izquierda */}
      <mesh position={[-5, 3, 0]} receiveShadow>
        <boxGeometry args={[0.3, 6, 14]} />
        <meshStandardMaterial color={palette.cream} roughness={0.95} />
      </mesh>
      {/* Rodapié */}
      <mesh position={[0, 0.16, -4.83]}>
        <boxGeometry args={[14, 0.32, 0.1]} />
        <meshStandardMaterial color={palette.navy} roughness={0.7} />
      </mesh>
      <mesh position={[-4.83, 0.16, 0]}>
        <boxGeometry args={[0.1, 0.32, 14]} />
        <meshStandardMaterial color={palette.navy} roughness={0.7} />
      </mesh>

      {/* Ventana en la pared izquierda */}
      <group position={[-4.84, 2.6, 1.4]} rotation={[0, Math.PI / 2, 0]}>
        {/* Cielo */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[3.4, 2.4]} />
          <meshBasicMaterial color={palette.sky} toneMapped={false} />
        </mesh>
        {/* Nubes */}
        <mesh position={[-0.7, 0.5, 0.02]}>
          <circleGeometry args={[0.36, 24]} />
          <meshBasicMaterial color={palette.white} toneMapped={false} />
        </mesh>
        <mesh position={[-0.3, 0.42, 0.02]}>
          <circleGeometry args={[0.26, 24]} />
          <meshBasicMaterial color={palette.white} toneMapped={false} />
        </mesh>
        <mesh position={[0.9, -0.3, 0.02]}>
          <circleGeometry args={[0.3, 24]} />
          <meshBasicMaterial color={palette.white} toneMapped={false} />
        </mesh>
        {/* Sol */}
        <mesh position={[1.1, 0.75, 0.02]}>
          <circleGeometry args={[0.22, 24]} />
          <meshBasicMaterial color={palette.amber} toneMapped={false} />
        </mesh>
        {/* Marco */}
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[0.07, 2.5, 0.08]} />
          <meshStandardMaterial color={palette.white} />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[3.5, 0.07, 0.08]} />
          <meshStandardMaterial color={palette.white} />
        </mesh>
        {[-1.75, 1.75].map((x) => (
          <mesh key={x} position={[x, 0, 0.06]}>
            <boxGeometry args={[0.16, 2.56, 0.16]} />
            <meshStandardMaterial color={palette.navy} />
          </mesh>
        ))}
        {[-1.24, 1.24].map((y) => (
          <mesh key={y} position={[0, y, 0.06]}>
            <boxGeometry args={[3.66, 0.16, 0.16]} />
            <meshStandardMaterial color={palette.navy} />
          </mesh>
        ))}
        {/* Alféizar */}
        <mesh position={[0, -1.36, 0.14]} castShadow>
          <boxGeometry args={[3.9, 0.14, 0.42]} />
          <meshStandardMaterial color={palette.white} roughness={0.7} />
        </mesh>
      </group>

      {/* Haz de luz de la ventana */}
      <mesh position={[-2.6, 0.01, 1.6]} rotation={[-Math.PI / 2, 0, 0.18]}>
        <planeGeometry args={[3.6, 3]} />
        <meshBasicMaterial color={palette.amber} transparent opacity={0.16} toneMapped={false} />
      </mesh>

      {/* Alfombra */}
      <mesh position={[1.4, 0.01, 1.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.5, 40]} />
        <meshStandardMaterial color={palette.navyLight} roughness={1} />
      </mesh>
      <mesh position={[1.4, 0.02, 1.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.9, 2.1, 40]} />
        <meshStandardMaterial color={palette.coral} roughness={1} />
      </mesh>

      {/* Cuadros en la pared trasera */}
      <group position={[-2.6, 3.5, -4.82]}>
        <mesh>
          <boxGeometry args={[1.1, 0.85, 0.08]} />
          <meshStandardMaterial color={palette.white} />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[0.9, 0.65]} />
          <meshBasicMaterial color={palette.mint} toneMapped={false} />
        </mesh>
      </group>
      <group position={[-1.2, 3.9, -4.82]}>
        <mesh>
          <boxGeometry args={[0.7, 0.7, 0.08]} />
          <meshStandardMaterial color={palette.white} />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[0.52, 0.52]} />
          <meshBasicMaterial color={palette.coral} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
