# Client Management Specification

## Purpose

ABM de clientes de la barbería.

## Requirements

### Requirement: Listar clientes

The system MUST display all clients from `GET /api/clients` in a table (nombre, teléfono, email).

#### Scenario: Lista cargada al entrar

- GIVEN el backend responde con la lista de clientes
- WHEN el usuario navega a la sección de clientes
- THEN se muestran todos los clientes en una tabla

### Requirement: Crear cliente

The system MUST allow creating a client via `POST /api/clients` con name, phone, email.

#### Scenario: Creación exitosa

- GIVEN el formulario de nuevo cliente completo con datos válidos
- WHEN el usuario envía el formulario
- THEN se crea el cliente y la tabla se actualiza

#### Scenario: Campos inválidos

- GIVEN el formulario con campos vacíos o inválidos
- WHEN el usuario envía
- THEN se muestran errores de validación

### Requirement: Editar y eliminar

The system SHOULD allow updating and deleting clients.

#### Scenario: Editar cliente

- GIVEN un cliente existente en la tabla
- WHEN el usuario hace clic en editar y modifica datos
- THEN `PUT /api/clients/{id}` se ejecuta y la tabla se actualiza

#### Scenario: Eliminar cliente

- GIVEN un cliente existente
- WHEN el usuario confirma la eliminación
- THEN `DELETE /api/clients/{id}` se ejecuta y el cliente desaparece de la tabla
