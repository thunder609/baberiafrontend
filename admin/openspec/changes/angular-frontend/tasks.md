# Tasks: Angular Frontend

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~2500 (100% new code) |
| 400-line budget risk | High |
| Chained PRs recommended | No (proyecto nuevo, arrancar con un solo PR tiene sentido) |
| Decision needed before apply | Yes (user decides) |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

## PR 1 — Foundation + Services + Layout (stacked-to-main → main)

### Foundation

- [x] 1.1 `ng new frontbarberia` — standalone, zoneless, Tailwind, Vitest. Configurar proxy a `localhost:8080/api` en `angular.json`
- [x] 1.2 Crear `src/app/core/models/` — interfaces `Client`, `Barber`, `Service`, `Appointment`, `Schedule`, `ScheduleOverride`
- [x] 1.3 Instalar y configurar Tailwind CSS (`postcss.config.js`, directivas en `styles.css`)

### Services

- [x] 2.1 `ClientService` — CRUD vía HttpClient
- [x] 2.2 `BarberService` — CRUD + activate/deactivate
- [x] 2.3 `ServiceService` — CRUD + activate/deactivate
- [x] 2.4 `AppointmentService` — crear, listar por barbero+fecha, transiciones de estado
- [x] 2.5 `ScheduleService` — CRUD horarios semanales
- [x] 2.6 `OverrideService` — CRUD excepciones

### Layout + Routing

- [x] 3.1 `SidebarComponent` — nav con links a cada feature
- [x] 3.2 `AppComponent` — shell con sidebar + router-outlet
- [x] 3.3 `app.routes.ts` — 6 rutas lazy + ruta raíz con dashboard simple
- [x] 3.4 `app.config.ts` — providers (HttpClient, withFetch)

## PR 2 — Features CRUD (stacked-to-main → main)

- [x] 4.1 `ClientListComponent` — tabla + modal crear/editar/eliminar
- [x] 4.2 `BarberListComponent` — tabla + CRUD + toggle activate/deactivate
- [x] 4.3 `ServiceListComponent` — tabla + CRUD + toggle activate/deactivate

## PR 3 — Features Complejos + Tests (stacked-to-main → main)

- [ ] 5.1 `AppointmentViewComponent` — selector barbero+fecha, tabla de turnos, botones de estado (confirmar, empezar, completar, cancelar, no-show), modal crear turno
- [ ] 5.2 `ScheduleComponent` — grilla semanal por barbero, CRUD inline
- [ ] 5.3 `OverrideComponent` — lista de excepciones por barbero, crear/eliminar
- [ ] 6.1 Tests unitarios de servicios (HttpClientTestingController)
- [ ] 6.2 Tests de componentes principales (AppointmentView, ClientList)
- [ ] 6.3 Verificar que `ng test` pasa sin errores
