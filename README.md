# Visual robot: agente de IA

Una oficina 3D cartoon donde tus agentes de IA son robots que trabajan en despachos, y tú los visitas con tu propio robot.

- **[`oficina-simbai/`](oficina-simbai/)** es la oficina: un HTML con Three.js y un servidor Python de 90 líneas, sin build. Lee los logs reales de tus agentes; al acercarte a uno ves su actividad y coste. Cómo arrancarla, en su [README](oficina-simbai/README.md).
- **`packages/web`** es la app generada con Runable (React Three Fiber). Su prototipo "AI Office 3D" aportó el personaje robot, la paleta y el mobiliario, descritos en [design.md](design.md). Su página de inicio redirige ahora a la oficina fusionada, que está copiada en `packages/web/public/`, así que al publicar la app con Runable se ve la misma oficina. Se arranca con Bun, como describe la plantilla de abajo.

---

# App template

Runable copies this Bun and Turborepo project into each new sandbox.

The root package commands are the external contract:

- `bun run dev` starts the web app.
- `bun run dev:desktop` and `bun run dev:mobile` start platform clients.
- `bun run build` builds every package.
- `bun run start` starts or restarts the production server.
- `bun run stop` stops the production server.
- `bun run lint` and `bun run typecheck` validate the project.
- The `db:generate`, `db:migrate`, and `db:push` commands manage the database.

Deployment tools depend on these command names. Their implementations may change, but the names must remain stable.

The web package owns the API, database, and shared web interface. The mobile package is an Expo client. The desktop package is an Electron shell around the web app. Services use the fixed ports defined in `__ports.cjs`, and the web health endpoint is `/api/health`.

Secrets belong in the root `.env` file. Browser values must use the `VITE_` prefix. Commands prefixed with `internal:` are for template maintenance.
