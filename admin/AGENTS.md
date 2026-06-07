# AGENTS.md — frontbarberia

## Current state

**Angular 21 SPA** (standalone, zoneless, signals, Tailwind CSS v4) consumiendo APIs REST de barberia (Spring Boot 4, `/api/*` proxy a `localhost:8080`).

SDD change activo: `angular-frontend` (3 PRs stacked-to-main). PR #1 y PR #2 implementados.

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | Angular 21 — standalone, zoneless, signals |
| Build | `@angular/build` (Vite), Vitest v4 |
| CSS | Tailwind CSS v4 |
| Test | Vitest + jsdom + `TestBed` |
| Node | 22.13 |

## Comandos

```bash
npm start              # ng serve (dev con proxy a localhost:8080)
npm run build          # ng build (producción)
npm test               # ng test (Vitest watch)
npx vitest --run       # Tests single-run
```

## Estructura

```
src/
├── app/
│   ├── core/
│   │   ├── models/        # Interfaces (Client, Barber, etc.)
│   │   └── services/      # HttpClient + signals
│   ├── features/
│   │   ├── clients/       # CRUD clientes
│   │   ├── barbers/       # CRUD + activar/desactivar
│   │   ├── services/      # CRUD servicios
│   │   ├── appointments/  # Turnos por barbero+fecha + estados
│   │   ├── schedules/     # Horarios semanales
│   │   └── overrides/     # Excepciones de horario
│   └── shared/layout/     # Sidebar, App shell
├── test-setup.ts          # TestBed.initTestEnvironment
└── vitest.config.ts       # Config Vitest
```

## Reglas importantes

- `ng test` usa Vitest (no Karma/Jasmine). Tests con `describe`/`it`/`expect` de `vitest`.
- Para tests single-run: `npx vitest --run` (no existe `--run` para `ng test`).
- Proxy API configurado en `proxy.conf.json` + `angular.json`. En dev todas las llamadas a `/api/*` van a `localhost:8080`.
- Tailwind v4: config vía `@import "tailwindcss"` en `styles.css`, `postcss.config.js` con `@tailwindcss/postcss`.
- Componentes standalone sin `.component` sufijo (app.ts, app.html, app.css). Angular 21 quitó el sufijo.
- No hay `platform-browser-dynamic`. Test setup usa `@angular/platform-browser/testing`.
- API base vacío (usa proxy en dev). Para producción, configurar URL base en environment o interceptor.

## OpenCode config

Global en `~/.config/opencode/opencode.json`. No hay `opencode.json` en el repo. Skill registry en `.atl/skill-registry.md`.

SDD: el orquestador delega a sub-agentes para leer, escribir, testear, revisar.

## PRs pendientes

- **PR #2**: CRUD completo (crear/editar/eliminar) en Clients, Barbers, Services
- **PR #3**: Appointment (calendario + transiciones de estado) + Schedules + Overrides + Tests

No es git repo. `git init` antes de cualquier operación de versionado.
