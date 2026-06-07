# Schedule Override Management Specification

## Purpose

Gestión de excepciones de horario (feriados, licencias, horas extra).

## Requirements

### Requirement: Ver excepciones de un barbero

The system MUST display overrides for a barber via `GET /api/barbers/{barberId}/overrides`. Soporta filtro opcional `?date=YYYY-MM-DD`.

#### Scenario: Lista de excepciones

- GIVEN la vista de excepciones de un barbero
- WHEN el usuario selecciona un barbero
- THEN se muestran fecha, hora inicio, hora fin, disponible, motivo

### Requirement: Crear excepción

The system MUST allow creating overrides via `POST /api/barbers/{barberId}/overrides` con date, startTime, endTime, available, reason.

#### Scenario: Bloqueo por feriado

- GIVEN el formulario de nueva excepción
- WHEN el usuario crea un bloqueo con available=false y motivo "Feriado"
- THEN el barbero no aparece como disponible ese día

#### Scenario: Horario extraordinario

- GIVEN el formulario
- WHEN el usuario crea una excepción con available=true en un día no laboral
- THEN el barbero aparece disponible en ese horario

### Requirement: Eliminar excepción

The system MUST allow deleting overrides via `DELETE /api/barbers/{barberId}/overrides/{id}`.

#### Scenario: Eliminar excepción

- GIVEN una excepción existente
- WHEN el usuario confirma eliminación
- THEN la excepción se elimina
