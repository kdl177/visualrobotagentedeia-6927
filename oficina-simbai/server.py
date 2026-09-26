"""Sirve la oficina 3D y expone /api/agentes leyendo los logs de cada agente. Solo stdlib."""
import json
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
AGENTES_DIR = Path(os.environ.get("AGENTES_DIR", ROOT / "agents"))
HOST = os.environ.get("HOST", "127.0.0.1")
PUERTO = int(os.environ.get("PUERTO", "8794"))


def agentes(raiz=AGENTES_DIR):
    out = []
    carpetas = sorted(p for p in raiz.iterdir() if p.is_dir() and not p.name.startswith(("_", "."))) if raiz.is_dir() else []
    for base in carpetas:
        log = base / "logs" / "conversaciones.jsonl"
        filas = []
        if log.exists():
            for linea in log.read_text(encoding="utf-8").splitlines():
                try:
                    filas.append(json.loads(linea))
                except json.JSONDecodeError:
                    continue
        coste = sum(f.get("costeUsd") or 0 for f in filas)
        ultima = filas[-1] if filas else {}
        out.append({
            "nombre": base.name,
            "existe": True,
            "conversaciones": len(filas),
            "turnos": sum(f.get("turnos") or 0 for f in filas),
            "coste": round(coste, 4),
            "coste_medio": round(coste / len(filas), 4) if filas else 0,
            "incompletas": sum(1 for f in filas if f.get("incompleta")),
            "modelo": ultima.get("modelo"),
            "ultima": (ultima.get("ts") or "")[:16].replace("T", " "),
            "evals": (base / "evals").exists(),
        })
    return {"agentes": out,
            "coste_total": round(sum(a["coste"] for a in out), 4),
            "conversaciones_total": sum(a["conversaciones"] for a in out)}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(ROOT), **kw)

    def _json(self, obj, codigo=200):
        cuerpo = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(codigo)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(cuerpo)))
        self.end_headers()
        self.wfile.write(cuerpo)

    def do_GET(self):
        if self.path == "/":
            self.path = "/oficina.html"
        if self.path.startswith("/api/agentes"):
            self._json(agentes())
            return
        if self.path.startswith("/api/"):
            # la oficina pide /api/acciones (briefing del CRM de SIMBAI OS); aquí no existe
            self._json({"error": "no disponible en el servidor minimo"}, 404)
            return
        super().do_GET()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, *a):
        pass


class Servidor(ThreadingHTTPServer):
    # en Windows, con SO_REUSEADDR dos procesos pueden compartir el puerto en silencio: mejor fallar
    allow_reuse_address = False


def demo():
    import tempfile
    with tempfile.TemporaryDirectory() as tmp:
        raiz = Path(tmp)
        (raiz / "_template").mkdir()
        log = raiz / "ejemplo" / "logs"
        log.mkdir(parents=True)
        (log / "conversaciones.jsonl").write_text(
            '{"ts":"2026-01-01T10:00:00.000Z","modelo":"claude-sonnet-5","turnos":3,"costeUsd":0.04}\n'
            'linea rota\n'
            '{"ts":"2026-01-02T10:00:00.000Z","modelo":"claude-sonnet-5","turnos":1,"costeUsd":0.02,"incompleta":true}\n',
            encoding="utf-8")
        r = agentes(raiz)
    assert [a["nombre"] for a in r["agentes"]] == ["ejemplo"], "ignora _template"
    a = r["agentes"][0]
    assert a["conversaciones"] == 2 and a["turnos"] == 4 and a["incompletas"] == 1
    assert a["coste"] == 0.06 and a["coste_medio"] == 0.03
    assert a["ultima"] == "2026-01-02 10:00" and a["modelo"] == "claude-sonnet-5"
    assert r["coste_total"] == 0.06 and r["conversaciones_total"] == 2
    assert agentes(Path(tmp)) == {"agentes": [], "coste_total": 0, "conversaciones_total": 0}, "sin carpeta: vacio"
    print("ok")


if __name__ == "__main__":
    if "--test" in sys.argv:
        demo()
    else:
        print(f"Oficina 3D  ->  http://{HOST}:{PUERTO}   (agentes en {AGENTES_DIR})")
        Servidor((HOST, PUERTO), Handler).serve_forever()
