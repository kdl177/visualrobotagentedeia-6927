# Oficina SIMBAI: tus agentes de IA como una oficina 3D

Un edificio con pasillo y despachos. Cada agente de IA es un trabajador en su mesa; tú recorres la oficina con tu personaje y, al acercarte a alguien, ves qué ha hecho y cuánto ha costado. Los datos salen de los logs reales de los agentes, no hay nada inventado.

![Oficina 3D](docs/captura.png)

- La lámpara y la pantalla de cada mesa se encienden según la última conversación: verde en las últimas 24 h, ámbar en la última semana, gris si hace más.
- Una hoja de papel por cada 6 conversaciones; una carpeta roja si hay conversaciones incompletas.
- Las mesas sin agente se ven apagadas, listas para el siguiente.
- Tu despacho cierra el pasillo. Empiezas en él.

Un solo archivo HTML con [Three.js](https://threejs.org/) por CDN. Sin build, sin npm.

## Ejecutar

Necesita Python 3.10 o superior. Nada más.

```bash
cd oficina-simbai
AGENTES_DIR=/ruta/a/tus/agents python server.py
```

En PowerShell:

```powershell
cd oficina-simbai
$env:AGENTES_DIR = "C:\ruta\a\tus\agents"
python server.py
```

Abre `http://localhost:8794`. Variables opcionales: `PUERTO` (8794) y `HOST` (`127.0.0.1`; pon `0.0.0.0` para verla desde el móvil en tu red).

## Qué espera encontrar

`AGENTES_DIR` es una carpeta con un subdirectorio por agente. Las carpetas que empiezan por `_` o `.` se ignoran. De cada agente se lee `logs/conversaciones.jsonl`, una línea JSON por conversación:

```json
{"ts":"2026-09-24T22:23:54.944Z","modelo":"claude-sonnet-5","turnos":3,"tokensEntrada":16749,"tokensSalida":361,"costeUsd":0.0694,"duracionMs":6257,"incompleta":false}
```

Solo se usan `ts`, `modelo`, `turnos`, `costeUsd` e `incompleta`. Si la carpeta no existe o no hay logs, la oficina se construye igual con las mesas apagadas.

## Despachos

`despachos.json` define los despachos: nombre, agentes asignados y número de mesas. Añadir un despacho es añadir una entrada. Los agentes que no estén asignados a ninguno caen al primero. La entrada con `"tuyo": true` es tu despacho.

```json
[
  { "nombre": "Tu despacho", "tuyo": true },
  { "nombre": "SIMBAI", "agentes": ["captacion-crm", "recepcion-abogados"] },
  { "nombre": "Despacho 2", "mesas": 2 }
]
```

## Controles

- Escritorio: WASD o flechas para moverte, clic en el suelo para ir a un punto, arrastrar para girar la cámara, rueda para acercar.
- Móvil: toca el suelo para andar, un dedo para girar, dos para acercar.
- Al acercarte a una mesa ocupada se abre la ficha del agente; al alejarte se cierra. Tocar una etiqueta te lleva andando hasta esa mesa.

## Comprobar

```bash
python server.py --test
```

Y en el navegador, `http://localhost:8794/?test` ejecuta los asserts de actividad y colisión en la consola.

## Origen

Es la oficina 3D de SIMBAI OS, el panel interno de [SIMBAI](https://github.com/kdl177), extraída para que funcione sola. En SIMBAI OS, tu mesa muestra además el briefing del CRM; aquí ese panel indica que no hay datos, porque el servidor mínimo no expone el CRM.
