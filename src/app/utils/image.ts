
/**
 * getExt(name)
 * ---------------------------------------------------------
 * ¿Qué hace? Devuelve la extensión del nombre de archivo en minúsculas.
 * Ej: "foto.JPG" -> "jpg".
 * ¿Por qué? Para comparar extensiones de forma consistente.
 * Casos especiales: si no tiene punto, devuelve '' (sin extensión).
 */
export function getExt(name: string): string {
  const idx = name.lastIndexOf('.');
  // Mejora opcional: evitar tomar ".gitignore" como "gitignore"
  const hasRealExt = idx > 0 && idx < name.length - 1;
  return hasRealExt ? name.slice(idx + 1).toLowerCase() : '';
}

/**
 * isAllowedImage(file, allowedMime, allowedExt)
 * ---------------------------------------------------------
 * ¿Qué hace? Comprueba si el archivo es una imagen permitida
 * verificando tanto su tipo MIME como su extensión.
 * ¿Por qué? Defensa doble: evita que un archivo renombrado se cuele.
 * allowedMime y allowedExt deben estar en minúsculas.
 */
export function isAllowedImage(
  file: File,
  allowedMime: Set<string>,
  allowedExt: Set<string>
): boolean {
  const okMime = file.type ? allowedMime.has(file.type) : true; 
  const ext = getExt(file.name);
  const okExt = allowedExt.has(ext);
  return okMime && okExt;
}

/**
 * getImageSize(file)
 * ---------------------------------------------------------
 * ¿Qué hace? Intenta decodificar la imagen y devuelve sus dimensiones (ancho/alto).
 * ¿Por qué? Para asegurarte de que la imagen es real y cumple tamaño mínimo.
 * Cómo: Primero usa createImageBitmap (rápido); si falla, usa un <img> con blob: URL.
 * Limpieza: Cierra el bitmap y revoca la URL para no consumir memoria.
 * Nota: El tamaño no corrige orientación EXIF; es el tamaño “crudo”.
 */
export async function getImageSize(file: File): Promise<{ width: number; height: number }> {
  try {
    const bmp = await createImageBitmap(file);
    const size = { width: bmp.width, height: bmp.height };
    bmp.close?.(); // liberar recursos si el navegador lo soporta
    return size;
  } catch {
    const url = URL.createObjectURL(file);
    try {
      return await new Promise<{ width: number; height: number }>((resolve, reject) => {
        const img = new Image();

        // Seguridad: si la imagen no carga nunca, cancelamos tras 5s
        const timeout = setTimeout(() => reject(new Error('decode_timeout')), 5000);

        img.onload = () => {
          clearTimeout(timeout);
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('decode_error'));
        };
        img.src = url; // importante: asignar src después de los handlers
      });
    } finally {
      URL.revokeObjectURL(url); // liberar la URL temporal blob:
    }
  }
}

