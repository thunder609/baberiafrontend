# Design: Angular Frontend

## Technical Approach

SPA Angular 21 standalone + signals + zoneless. Cada entidad del backend es un feature module lazy-loaded. Servicios con `HttpClient` que exponen signals. Sin store externo — signals locales + `resource()` para fetching. CSS propio minimalista, sin Tailwind ni Material.

## Architecture Decisions

| Decisión | Opciones | Elegido | Razón |
|----------|----------|---------|-------|
| State management | Signals vs RxJS vs NgRx | Signals | Sin store global para este tamaño de app. Signals + resource() cubre fetching y estado local. |
| UI framework | Material vs Tailwind vs CSS propio | Tailwind CSS | Utilidades rápidas, diseño consistente sin sobrecarga de componentes. |
| Routing | Standalone lazy | Lazy por feature | Cada ruta carga solo su módulo. App shell + 6 rutas lazy. |
| HTTP layer | HttpClient + signals | Servicios con subjects signals | Cada servicio mantiene un signal `#list` que se actualiza tras cada operación CRUD. |

## Component Tree

```
AppComponent
├── SidebarComponent (nav)
└── <router-outlet>
    ├── DashboardComponent           (/) — bienvenida
    ├── ClientListComponent          (/clients) — tabla + modal inline
    ├── BarberListComponent          (/barbers)
    ├── ServiceListComponent         (/services)
    ├── AppointmentViewComponent     (/appointments?barberId&date) — selector barbero + fecha
    ├── ScheduleComponent            (/barbers/:id/schedules) — grilla semanal
    └── OverrideComponent            (/barbers/:id/overrides)
```

Cada feature con CRUD usa un modal/dialog inline (sin librería externa, `<dialog>` nativo o un div modal con CSS).

## Data Flow

```
Component ──→ Service (HttpClient) ──→ API ──→ Backend
    │                                            │
    └──────── signal.update() ←──────────────────┘
```

- Servicio expone `readonly items = signal<T[]>([])`
- Componente llama `service.items()` en template
- CRUD operations: llaman API, luego `items.update()` con resultado
- Loading/error: signals locales `isLoading`, `error`

## Routes

| Path | Component | Guard |
|------|-----------|-------|
| `/` | DashboardComponent | — |
| `/clients` | ClientListComponent | — |
| `/barbers` | BarberListComponent | — |
| `/services` | ServiceListComponent | — |
| `/appointments` | AppointmentViewComponent | — |
| `/barbers/:id/schedules` | ScheduleComponent | — |
| `/barbers/:id/overrides` | OverrideComponent | — |

## File Changes

| File | Action |
|------|--------|
| `src/app/app.component.ts` | Create — shell con sidebar + router-outlet |
| `src/app/app.routes.ts` | Create — rutas lazy |
| `src/app/app.config.ts` | Create — providers (HttpClient, etc.) |
| `src/app/core/models/*.ts` | Create — interfaces Client, Barber, Service, Appointment, Schedule, Override |
| `src/app/core/services/*.service.ts` | Create — 6 servicios HTTP |
| `src/app/features/*/*.ts` | Create — 6 features (list + optional form modal) |
| `src/app/shared/layout/sidebar.component.ts` | Create — navegación lateral |
| `src/styles.css` | Create — CSS global minimalista |

## Testing Strategy

| Capa | Qué probar | Enfoque |
|------|-----------|---------|
| Unit | Servicios HTTP | HttpClientTestingController |
| Unit | Componentes | Vitest + Angular Testing Library |
| Integration | Routing | Router harness |

No hay backend mock para tests — usar HTTP interceptors o mocks manuales.

## Migration / Rollout

Proyecto nuevo — no hay migración. Arrancar con `ng new` y luego estructurar manualmente.

## Open Questions

None.
