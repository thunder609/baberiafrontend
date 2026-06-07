# Barber Management Specification

## Purpose

ABM de barberos con activación/desactivación.

## Requirements

### Requirement: Listar barberos

The system MUST display all barbers from `GET /api/barbers` con filtro `?onlyActive=true`.

#### Scenario: Lista completa

- GIVEN el backend responde con barberos
- WHEN el usuario ve la lista
- THEN se muestran nombre, teléfono, email, estado activo/inactivo

### Requirement: Crear, editar, eliminar

The system MUST support full CRUD via `POST`, `PUT`, `DELETE /api/barbers`.

#### Scenario: Crear barbero

- GIVEN formulario con datos válidos
- WHEN el usuario envía
- THEN el barbero se crea y aparece en la lista

### Requirement: Activar / desactivar

The system MUST allow toggling barber status via `PATCH /api/barbers/{id}/activate` y `/deactivate`.

#### Scenario: Desactivar barbero

- GIVEN un barbero activo
- WHEN el usuario hace clic en desactivar
- THEN `PATCH /deactivate` se ejecuta y el estado cambia a inactivo

#### Scenario: Reactivar barbero

- GIVEN un barbero inactivo
- WHEN el usuario hace clic en activar
- THEN `PATCH /activate` se ejecuta y el estado cambia a activo
