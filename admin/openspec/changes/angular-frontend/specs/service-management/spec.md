# Service Management Specification

## Purpose

ABM de servicios ofrecidos (corte, barba, etc.).

## Requirements

### Requirement: Listar servicios

The system MUST display all services from `GET /api/services` con filtro `?onlyActive=true`.

#### Scenario: Lista con datos clave

- GIVEN el backend responde con servicios
- WHEN el usuario ve la lista
- THEN se muestran nombre, descripción, duración, precio, estado

### Requirement: CRUD de servicios

The system MUST support create, update, and delete via `POST`, `PUT`, `DELETE /api/services`.

#### Scenario: Crear servicio

- GIVEN formulario con nombre, descripción, duración en minutos y precio
- WHEN el usuario envía
- THEN el servicio se crea y aparece en la lista

#### Scenario: Precio inválido

- GIVEN el formulario con precio negativo
- WHEN el usuario envía
- THEN se muestra error de validación

### Requirement: Activar / desactivar

The system MUST allow toggling service status via `PATCH /api/services/{id}/activate` y `/deactivate`.

#### Scenario: Desactivar servicio

- GIVEN un servicio activo
- WHEN el usuario lo desactiva
- THEN el servicio no aparece en selectores de turnos
