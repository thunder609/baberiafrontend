import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private readonly supabaseUrl = environment.supabaseUrl;
  private readonly supabaseKey = environment.supabaseKey;
  private readonly bucketName = 'Barberia';

  /**
   * Sube una imagen directamente a Supabase Storage usando fetch.
   * @param file Archivo de imagen.
   * @param barberId ID del barbero para nombrar el archivo.
   * @returns URL pública de la imagen.
   */
  async uploadBarberImage(file: File, barberId: string): Promise<string> {
    // Validar archivo
    if (!file.type.match('image.*')) {
      throw new Error('Solo se permiten imágenes (JPG, PNG, etc.)');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('La imagen es demasiado grande (máx. 5MB)');
    }

    const fileName = `barber-${barberId}-${Date.now()}.jpg`;

    // URL correcta de Supabase Storage
    const uploadUrl = `${this.supabaseUrl}/storage/v1/object/${this.bucketName}/${fileName}`;

    console.log('Subiendo a Supabase:', uploadUrl);

    // Subir usando fetch directamente
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'apikey': this.supabaseKey,
        'Authorization': `Bearer ${this.supabaseKey}`,
        'Content-Type': 'image/jpeg',
      },
      body: file,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error Supabase:', response.status, errorText);
      throw new Error(`Error al subir imagen (${response.status}): ${errorText}`);
    }

    // Construir la URL pública manualmente
    const publicUrl = `${this.supabaseUrl}/storage/v1/object/public/${this.bucketName}/${fileName}`;
    console.log('Imagen subida correctamente:', publicUrl);
    return publicUrl;
  }

  /**
   * Sube una imagen a una carpeta específica de Supabase Storage.
   * @param file Archivo de imagen.
   * @param folder Carpeta destino (ej: 'services/', 'barbers/').
   * @returns URL pública de la imagen.
   */
  async uploadImage(file: File, folder: string): Promise<string> {
    if (!file.type.match('image.*')) {
      throw new Error('Solo se permiten imágenes (JPG, PNG, etc.)');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('La imagen es demasiado grande (máx. 5MB)');
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${folder}${Date.now()}.${ext}`;

    const uploadUrl = `${this.supabaseUrl}/storage/v1/object/${this.bucketName}/${fileName}`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'apikey': this.supabaseKey,
        'Authorization': `Bearer ${this.supabaseKey}`,
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al subir imagen (${response.status}): ${errorText}`);
    }

    const publicUrl = `${this.supabaseUrl}/storage/v1/object/public/${this.bucketName}/${fileName}`;
    return publicUrl;
  }

  /**
   * Elimina una imagen de Supabase Storage.
   * @param imageUrl URL completa de la imagen.
   */
  async deleteBarberImage(imageUrl: string): Promise<void> {
    const fileName = imageUrl.split('/').pop();
    if (!fileName) throw new Error('URL de imagen inválida');

    const deleteUrl = `${this.supabaseUrl}/storage/v1/object/${this.bucketName}/${fileName}`;

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'apikey': this.supabaseKey,
        'Authorization': `Bearer ${this.supabaseKey}`,
      },
    });

    if (!response.ok) {
      console.error('Error al eliminar imagen:', await response.text());
      throw new Error('No se pudo eliminar la imagen');
    }
  }
}
