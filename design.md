# AI Office 3D — Design

Prototipo visual (web) de una **oficina virtual privada en 3D** habitada por un personaje agente de IA
en estilo cartoon / low-poly. Cámara orbitable, personaje con animación idle + estados (pensando,
hablando, trabajando), hotspots interactivos y un panel de chat mockup. Pensado como pieza embebible
(`<iframe>`) o como sección hero dentro de una web existente.

## Dirección visual

Cartoon amable, low-poly con esquinas redondeadas, materiales mate (toon-ish), luz cálida de tarde
entrando por la ventana + luz fría de pantalla. Nada de realismo: siluetas simples, colores planos
con acentos luminosos. Sombras suaves de contacto.

## Brand & Colors

CSS variables en `packages/web/src/web/styles.css`; los mismos hex se reutilizan en los materiales 3D
desde `lib/palette.ts` (única fuente de verdad para la escena).

| Token | Hex | Uso |
|-------|-----|-----|
| night | #141A2E | Fondo de página, texto sobre claro |
| navy | #1E2A4A | Paredes en sombra, muebles oscuros |
| cream | #F6EBDA | Suelo, superficies claras |
| coral | #FF6B4A | Acento principal (CTA, silla, detalles) |
| mint | #35E0AE | Agente IA: glow, visor, estado activo |
| sky | #6EC6FF | Ventana, pantalla, luz fría |
| amber | #FFC15E | Luz cálida, lámpara, madera clara |
| plum | #7A5CFF | Acento secundario (hologramas, UI) |

## Typography

- **Display**: Baloo 2 (700/800) — titulares, nombre del agente. Redondeado, coherente con el cartoon.
- **Body/UI**: Poppins (400/500/600) — copy, chat, etiquetas.
- Cargadas desde Google Fonts en `index.html`.

## Escena 3D (composición)

- `components/office/office-scene.tsx` — `<Canvas>`, cámara, luces, sombras, OrbitControls limitados.
- `office-room.tsx` — suelo, dos paredes, rodapié, ventana con cielo, alfombra, cuadros.
- `office-desk.tsx` — escritorio, monitor con pantalla emisiva, teclado, taza, silla, lámpara.
- `office-props.tsx` — planta, estantería, rack de servidor con LEDs, pizarra, cajas.
- `ai-agent.tsx` — personaje: cuerpo cápsula flotante, cabeza con visor, ojos que parpadean y miran
  al cursor, manos orbitando, anillo de energía, sombra/glow en el suelo.
- `hotspot.tsx` — puntos interactivos (drei `Html`) sobre monitor, pizarra y rack.

## Pages

- **Web — Home** (`packages/web/src/web/pages/index.tsx`): pantalla completa con la escena 3D + HUD
  superpuesto (header con nombre del agente y estado, panel de chat a la derecha, barra de estados
  abajo, hint de controles).

## Flujos

1. Entra → carga la escena con reveal escalonado del HUD → el agente saluda con una burbuja.
2. Arrastra para orbitar / rueda para zoom; el agente sigue el cursor con la mirada.
3. Pulsa un estado (Idle / Pensando / Hablando / Trabajando) o escribe en el chat → el agente cambia
   animación, color del glow y burbuja de texto; la cámara enfoca el hotspot relevante.
4. Clic en un hotspot (monitor, pizarra, rack) → tarjeta con la "capacidad" del agente.

## Notas técnicas

- React Three Fiber + drei sobre el template gestionado. Sin backend ni base de datos: es un prototipo
  visual, todo el estado vive en el cliente (`useAgentState`).
- Sin assets externos (modelos/HDR): toda la geometría es primitiva, así el prototipo funciona offline
  y carga en <1s.
