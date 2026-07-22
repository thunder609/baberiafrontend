# Tasks: Imágenes para servicios

## Review Workload Forecast
- **Archivos a modificar**: 8 (5 backend + 3 frontend)
- **Líneas estimadas**: ~150-200
- **400-line budget risk**: Low
- **Chained PRs recommended**: No
- **Decision needed before apply**: No

---

## Backend — Servicio `imageUrl`

### B1. Domain model
- [ ] Agregar `String imageUrl` a `BarberService.java`

### B2. DTOs
- [ ] Agregar `String imageUrl` a `ServiceRequest.java`
- [ ] Agregar `String imageUrl` a `ServiceResponse.java`

### B3. Entity
- [ ] Agregar `String imageUrl` con columna `image_url` a `ServiceEntity.java`

### B4. Mapper
- [ ] Mapear `imageUrl` en `BarberServiceMapper.java` (toEntity, toDomain, toResponse)

### B5. Migration
- [ ] Ejecutar `ALTER TABLE services ADD COLUMN image_url VARCHAR(500)` en la base

---

## Frontend — Angular

### F1. Modelo
- [ ] Agregar `imageUrl: string` a `BarberService` y `ServiceRequest` en `service.ts`

### F2. Service
- [ ] Inyectar `SupabaseService` en `ServiceService`
- [ ] Agregar método `uploadImage(file: File): Promise<string>`

### F3. Componente
- [ ] Agregar señal `imageFile` para el archivo seleccionado
- [ ] Agregar input file + preview de imagen en el template
- [ ] En `save()`: subir imagen si hay archivo, luego enviar request
- [ ] En `openEdit()`: mostrar preview si existe `imageUrl`
- [ ] En `openNew()`: limpiar `imageFile`

---

## Post-implementación

### V1. Verify
- [ ] Compilación TypeScript sin errores (`npx tsc --noEmit`)
- [ ] Build de Angular exitoso (`npm run build:admin`)
- [ ] Build de backend exitoso (`./mvnw compile`)

### V2. Deploy
- [ ] Commit + push en backend (render se redeployea solo)
- [ ] Commit + push en frontend (netlify se redeployea solo)
