# Schedule Management Specification

## Purpose

Gestión de horarios semanales por barbero.

## Requirements

### Requirement: Ver horarios de un barbero

The system MUST display weekly schedules for a barber via `GET /api/barbers/{barberId}/schedules`.

#### Scenario: Horarios visibles

- GIVEN la vista de horarios de un barbero
- WHEN el usuario selecciona un barbero
- THEN se muestran los horarios con día de semana, hora inicio y fin

### Requirement: Crear y editar horarios

The system MUST allow creating and updating schedules via `POST` y `PUT`.

#### Scenario: Agregar horario

- GIVEN un barbero seleccionado
- WHEN el usuario agrega un día con horario
- THEN `POST` se ejecuta y el horario aparece en la lista

#### Scenario: Editar horario existente

- GIVEN un horario existente
- WHEN el usuario modifica hora inicio o fin
- THEN `PUT` actualiza el registro

### Requirement: Eliminar horario

The system MUST allow deleting schedules via `DELETE /api/barbers/{barberId}/schedules/{id}`.

#### Scenario: Eliminar día

- GIVEN un horario existente
- WHEN el usuario confirma eliminación
- THEN el horario se elimina y desaparece de la lista
