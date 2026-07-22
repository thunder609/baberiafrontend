# Propuesta: Imágenes para servicios

## Resumen
Agregar subida de imágenes a Supabase Storage para los servicios de la barbería, replicando el patrón ya implementado para los barberos.

## Motivación
El admin necesita poder asociar una imagen a cada servicio (corte, barba, etc.) para que los clientes vean una foto representativa al reservar turno.

## Cambios necesarios

### Backend (`/home/oswaldo/proyectos/barberia/`)

| Archivo | Cambio |
|---------|--------|
| `domain/model/BarberService.java` | Agregar campo `imageUrl` |
| `interfaces/rest/dto/ServiceRequest.java` | Agregar campo `imageUrl` |
| `interfaces/rest/dto/ServiceResponse.java` | Agregar campo `imageUrl` |
| `infrastructure/mapper/BarberServiceMapper.java` | Mapear `imageUrl` |
| `infrastructure/persistence/entity/ServiceEntity.java` | Agregar columna `image_url` |
| Base de datos | Migration SQL: `ALTER TABLE services ADD COLUMN image_url VARCHAR(500)` |

### Frontend (`/home/oswaldo/proyectos/barberia-frontend/`)

| Archivo | Cambio |
|---------|--------|
| `admin/src/app/core/models/service.ts` | Agregar `imageUrl` a `BarberService` y `ServiceRequest` |
| `admin/src/app/core/services/service.service.ts` | Inyectar `SupabaseService`, agregar lógica de upload |
| `admin/src/app/features/services/services.ts` | Agregar file input, preview, y upload al guardar |

## Enfoque técnico
- Mismo `SupabaseService` existente (sube con fetch directo al bucket `Barberia`)
- Carpeta en Supabase: `services/` (ej: `services/corte-clasico.jpg`)
- El componente sube la imagen primero y envía la URL en el request al backend
- Sin compresión de imagen (por ahora, como en barberos)

## Lo que NO se toca
- `SupabaseService` (se reusa tal cual)
- Ningún otro componente (clientes, turnos, horarios)
- Ningún otro controlador del backend
- Ningún otro modelo del backend

## Riesgos
- Bajo: el patrón está probado con barberos
- La migration SQL hay que ejecutarla en producción contra Postgres de Render
