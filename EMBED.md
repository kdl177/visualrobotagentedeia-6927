# Cómo embeber la oficina virtual

Una vez publicada la web (botón de publicar en Runable), pega este iframe en tu landing:

```html
<div style="position:relative;width:100%;aspect-ratio:16/9;border-radius:20px;overflow:hidden">
  <iframe
    src="https://TU-DOMINIO/?embed=1&name=NOVA&tagline=Tu%20oficina%20virtual&accent=%2335E0AE"
    title="Oficina virtual con agente de IA"
    style="position:absolute;inset:0;width:100%;height:100%;border:0"
    allow="autoplay"
    loading="lazy"
  ></iframe>
</div>
```

## Parámetros de la URL

| Parámetro | Valores | Por defecto | Qué hace |
|---|---|---|---|
| `embed` | `1` / `0` | `0` | HUD compacto y viñeta suave, pensado para iframe |
| `name` | texto | `NOVA` | Nombre del agente en la cabecera |
| `tagline` | texto | `Oficina virtual privada` | Subtítulo bajo el nombre |
| `accent` | hex (`%23FF8A5B`) | mint `#35E0AE` | Color de marca del HUD |
| `chat` | `1` / `0` | `1` (`0` si `embed=1`) | Muestra el panel de conversación |
| `labels` | `1` / `0` | `1` | Muestra las etiquetas 3D de la sala (Panel, Memoria, Procesos) |

Recuerda codificar en URL: espacios como `%20` y `#` como `%23`.

## Notas

- Todo es geometría procedural (sin modelos ni texturas externas), así que carga rápido y funciona offline.
- Requiere WebGL; si el navegador no puede iniciarlo se muestra un fallback con mensaje en lugar de romperse.
- Interacciones: arrastrar para orbitar, rueda para zoom, clic en el agente y en las etiquetas para enfocar.
