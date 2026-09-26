# Oficina SIMBAI: tus agentes de IA como una oficina 3D

Un edificio cartoon con pasillo y despachos. Cada agente de IA es un robot flotante en su mesa; tú eres el robot coral, recorres la oficina y, al acercarte a alguien, ves qué ha hecho y cuánto ha costado. Los datos salen de los logs reales de los agentes, no hay nada inventado. El personaje, la paleta y el mobiliario vienen del prototipo de Runable de este mismo repo; la mecánica y los datos, de SIMBAI OS.

![Oficina 3D](docs/captura.png)

- El color de cada robot es su estado real: mint si ha trabajado en las últimas 24 h, ámbar en la última semana, violeta apagado si hace más o no hay datos. Los robots giran la cabeza hacia ti cuando pasas cerca.
- Una hoja de papel por cada 6 conversaciones; una carpeta coral si hay conversaciones incompletas.
- Las mesas sin agente conservan la silla vacía, listas para el siguiente.
- Tu despacho cierra el pasillo, con rack de servidores, pizarra y estantería. Empiezas en él.
- Si no hay conexión con los agentes, la oficina se construye igual y los agentes de `despachos.json` aparecen apagados con "sin datos".

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

Es la oficina 3D de SIMBAI OS, el panel interno de [SIMBAI](https://github.com/kdl177), fusionada con el prototipo "AI Office 3D" que Runable generó en `packages/web` (React Three Fiber): de ahí salen el robot, la paleta y los muebles. La página de esa app redirige ahora a esta oficina, que también se copia en `packages/web/public/`. En SIMBAI OS, tu mesa muestra además el briefing del CRM; aquí ese panel indica que no hay datos, porque el servidor mínimo no expone el CRM.
