# Visual robot: agente de IA

Dos oficinas 3D para ver agentes de IA trabajando:

- **[`oficina-simbai/`](oficina-simbai/)**: la oficina de SIMBAI. Un HTML con Three.js y un servidor Python de 80 líneas, sin build. Lee los logs reales de tus agentes y los pone a trabajar en despachos; tú los recorres con tu personaje. Cómo arrancarla, en su [README](oficina-simbai/README.md).
- **`packages/web`**: prototipo generado con Runable en React Three Fiber, con un personaje agente, HUD y chat de muestra. Se arranca con Bun, como describe la plantilla de abajo. Cómo embeberlo, en [EMBED.md](EMBED.md); diseño, en [design.md](design.md).

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
