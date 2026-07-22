# Spec: Imágenes para servicios

## Requerimientos funcionales

### RF1: Crear servicio con imagen
- El formulario de nuevo servicio incluye un selector de archivo para la imagen
- El admin puede seleccionar un archivo de imagen (jpg, png, webp)
- Al guardar, se sube la imagen a Supabase y se envía el servicio con la URL al backend
- Si no se selecciona imagen, el servicio se crea sin imagen (`imageUrl` vacío)

### RF2: Editar servicio con imagen
- Al editar, se muestra la imagen actual si existe
- El admin puede reemplazar la imagen seleccionando un archivo nuevo
- Si se selecciona una imagen nueva, se sube a Supabase y se actualiza la URL
- Si no se selecciona imagen nueva, se conserva la imagen actual
- El admin puede eliminar la imagen actual (opcional)

### RF3: Visualizar imagen en lista
- En la tabla de servicios, se muestra un thumbnail de la imagen si existe
- Si no tiene imagen, se muestra un placeholder genérico

### RF4: Persistencia
- El backend almacena la URL de la imagen en la columna `image_url`
- La imagen física se almacena en Supabase Storage, bucket `Barberia`, carpeta `services/`
- El frontend es responsable de subir la imagen; el backend solo guarda la URL

## Escenarios

### Escenario 1: Crear servicio con imagen
1. Admin abre el modal de nuevo servicio
2. Completa nombre, descripción, duración, precio
3. Selecciona un archivo de imagen
4. Ve el preview de la imagen
5. Click en Guardar
6. Sistema sube la imagen a Supabase → `services/{uuid}.jpg`
7. Sistema envía POST `/api/services` con `imageUrl: "https://..."` 
8. Backend persiste el servicio con la URL
9. Tabla se actualiza mostrando el thumbnail

### Escenario 2: Editar servicio sin cambiar imagen
1. Admin abre edición de un servicio existente con imagen
2. Ve la imagen actual en preview
3. No selecciona archivo nuevo
4. Click en Guardar
5. Sistema envía PUT `/api/services/{id}` con el `imageUrl` existente
6. No se sube nada a Supabase

### Escenario 3: Editar servicio cambiando imagen
1. Admin abre edición con imagen existente
2. Selecciona un archivo nuevo
3. Click en Guardar
4. Sistema sube la imagen nueva a Supabase (sobrescribe o nuevo UUID)
5. Sistema envía PUT con la nueva URL

### Escenario 4: Servicio sin imagen
1. Admin crea servicio sin seleccionar imagen
2. Sistema envía POST con `imageUrl: ""`
3. Backend persiste con `image_url` NULL
4. En la tabla se muestra placeholder

## Backend API (sin cambios en endpoints)

| Método | Endpoint | Cambio |
|--------|----------|--------|
| POST | `/api/services` | Acepta `imageUrl` en body |
| PUT | `/api/services/{id}` | Acepta `imageUrl` en body |
| GET | `/api/services` | Devuelve `imageUrl` en response |
| GET | `/api/services/{id}` | Devuelve `imageUrl` en response |
