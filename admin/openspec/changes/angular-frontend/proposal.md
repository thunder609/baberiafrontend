# Proposal: Angular Frontend

## Intent

Crear una SPA minimalista en Angular 21 que consuma las APIs REST de barberia para gestionar turnos, clientes, barberos, servicios y horarios.

## Scope

### In Scope
- CRUD de clientes, barberos, servicios desde el frontend
- Calendario de turnos por barbero + fecha
- Flujo completo del turno: crear, confirmar, empezar, completar, cancelar, no-show
- Gestión de horarios semanales y excepciones por barbero
- UI responsiva minimalista (sin framework CSS pesado)

### Out of Scope
- Autenticación / login (el backend no expone auth)
- Dashboard con estadísticas
- Notificaciones en tiempo real
- PWA / offline

## Capabilities

### New Capabilities
- `client-management`: ABM de clientes
- `barber-management`: ABM + activar/desactivar barberos
- `service-management`: ABM + activar/desactivar servicios
- `appointment-management`: ciclo completo del turno + vista por barbero/fecha
- `schedule-management`: horarios semanales por barbero
- `schedule-override-management`: excepciones de horario

### Modified Capabilities
None (proyecto nuevo, sin specs previas).

## Approach

Angular 21 standalone + signals + zoneless. HttpClient para APIs. Componentes puros, routing lazy. Sin NgModules. Vitest para tests unitarios. Tailwind CSS para estilos utilitarios.

API base: `http://localhost:8080/api` (configurable vía entorno).

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/` | New | App Angular completa |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Modelos del backend pueden cambiar | Low | Tipos desacoplados via interfaces, actualizar si cambia API |
| CORS no configurado en backend | Med | Proxy `angular.json` para dev, configurar CORS en backend para prod |

## Rollback Plan

Eliminar `src/` y `angular.json`. El proyecto no afecta al backend ni a otros servicios.

## Dependencies

- Backend barberia corriendo en `localhost:8080`
- Node.js 22+
- Angular CLI 21

## Success Criteria

- [ ] ng serve compila sin errores
- [ ] Todas las pantallas cargan datos del backend
- [ ] CRUD funcional para cada entidad
- [ ] Ciclo completo de turno (crear → confirmar → empezar → completar)
