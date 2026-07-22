# Design: Imágenes para servicios

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                   Services Component                  │
│  (file input → preview → upload → save)              │
└──────────┬──────────────────────────────┬────────────┘
           │                              │
           ▼                              ▼
┌──────────────────┐          ┌──────────────────────┐
│ SupabaseService   │          │   ServiceService      │
│ (upload fetch)    │          │   (API calls)         │
└────────┬─────────┘          └──────────┬───────────┘
         │                                │
         ▼                                ▼
┌──────────────────┐          ┌──────────────────────┐
│ Supabase Storage  │          │   Spring Boot API     │
│ Barberia/services │          │   /api/services       │
└──────────────────┘          └──────────────────────┘
```

## Flujo de datos (crear servicio con imagen)

```
1. User selecciona archivo → componente guarda File en señal
2. User click Guardar
3. Componente:
   a. Si hay File → llama SupabaseService.upload(file, "services/")
   b. Obtiene publicUrl
   c. Asigna publicUrl a form.imageUrl
   d. Llama ServiceService.create({...form, imageUrl})
4. ServiceService → POST /api/services
5. Backend persiste con image_url
6. Componente cierra modal, recarga lista
```

## Flujo de datos (editar servicio)

```
1. User abre edición → form se puebla con datos existentes (imageUrl incluido)
2. Si user selecciona archivo nuevo → similar a creación (pasos 3a-3c)
3. Si user NO selecciona archivo → form.imageUrl conserva el valor existente
4. Llama ServiceService.update(id, {...form, imageUrl})
5. ServiceService → PUT /api/services/{id}
```

## Cambios detallados

### Backend: BarberService.java (domain/model)
```java
public class BarberService {
    private Long id;
    private String name;
    private String description;
    private int durationMinutes;
    private BigDecimal price;
    private boolean active;
    private String imageUrl;  // NUEVO
}
```

### Backend: ServiceRequest.java
```java
public record ServiceRequest(
    String name,
    String description,
    int durationMinutes,
    BigDecimal price,
    String imageUrl  // NUEVO - nullable
) {}
```

### Backend: ServiceResponse.java
```java
public record ServiceResponse(
    Long id,
    String name,
    String description,
    int durationMinutes,
    BigDecimal price,
    boolean active,
    String imageUrl  // NUEVO - nullable
) {}
```

### Backend: ServiceEntity.java
```java
@Entity
@Table(name = "services")
public class ServiceEntity {
    // ... campos existentes ...
    private String imageUrl;  // NUEVO - columna image_url
}
```

### Backend: BarberServiceMapper.java
```java
// Agregar en toEntity, toDomain, toResponse:
// .imageUrl(entity.getImageUrl())
// .imageUrl(domain.getImageUrl())
```

### Frontend: service.ts (model)
```typescript
export interface BarberService {
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  active: boolean;
  imageUrl: string;  // NUEVO
}

export interface ServiceRequest {
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  imageUrl: string;  // NUEVO
}
```

### Frontend: service.service.ts
```typescript
@Injectable({ providedIn: 'root' })
export class ServiceService {
  readonly items = signal<BarberService[]>([]);
  
  constructor(
    private http: HttpClient,
    private supabase: SupabaseService,  // NUEVO
  ) {}
  
  // ... métodos existentes ...
  
  async uploadImage(file: File): Promise<string> {
    return this.supabase.upload(file, 'services/');
  }
}
```

### Frontend: services.ts (componente)
- Agregar señal `imageFile: Signal<File | null>`
- Agregar input file + preview en el template
- En `save()`: si hay `imageFile`, upload primero, luego enviar request
- En `openEdit()`: mostrar preview si existe `imageUrl`

## Supabase Storage
- Bucket: `Barberia` (ya existe, políticas públicas)
- Carpeta: `services/`
- Las imágenes existentes en Supabase NO se limpian al reemplazar (por simplicidad)

## Base de datos
```sql
ALTER TABLE services ADD COLUMN image_url VARCHAR(500);
```
