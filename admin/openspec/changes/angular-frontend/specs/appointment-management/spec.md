# Appointment Management Specification

## Purpose

Ciclo completo del turno: creación, visualización y transición de estados.

## Requirements

### Requirement: Vista de turnos por barbero y fecha

The system MUST display appointments for a barber+date via `GET /api/appointments?barberId=X&date=YYYY-MM-DD`.

#### Scenario: Seleccionar barbero y fecha

- GIVEN la vista de turnos
- WHEN el usuario selecciona un barbero y una fecha
- THEN se muestran los turnos con hora, cliente, servicio y estado

### Requirement: Crear turno

The system MUST allow creating appointments via `POST /api/appointments` con barberId, clientId, serviceId, startTime.

#### Scenario: Creación con cálculo automático de endTime

- GIVEN el formulario con barbero, cliente, servicio y hora de inicio
- WHEN el usuario envía
- THEN `POST /api/appointments` se ejecuta y el endTime se calcula según duración del servicio

#### Scenario: Superposición de turnos

- GIVEN un turno existente en el horario
- WHEN se intenta crear otro en el mismo horario
- THEN el backend rechaza y se muestra error

### Requirement: Transiciones de estado

The system MUST support state transitions: confirm, start, complete, cancel, no-show.

#### Scenario: Confirmar turno

- GIVEN un turno pendiente
- WHEN el usuario lo confirma
- THEN `PUT /{id}/confirm` se ejecuta

#### Scenario: Completar ciclo

- GIVEN un turno confirmado
- WHEN el usuario marca "empezar" y luego "completar"
- THEN los endpoints `start` y `complete` se ejecutan en orden

#### Scenario: Cancelar con motivo

- GIVEN un turno existente
- WHEN el usuario lo cancela
- THEN `PUT /{id}/cancel` se ejecuta y se puede incluir motivo

### Requirement: Filtrar turnos por estado

The system SHOULD allow filtering the appointment list by status.

#### Scenario: Filtro activo

- GIVEN la vista de turnos
- WHEN el usuario selecciona un estado (pendiente, confirmado, etc.)
- THEN solo se muestran turnos con ese estado
