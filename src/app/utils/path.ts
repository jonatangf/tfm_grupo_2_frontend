
/**
 * normalizeAvatarPath(input)
 * ---------------------------------------------------------
 * ¿Qué hace? Normaliza una ruta de avatar para guardarla/usar en el front.
 * - Si viene una URL absoluta (http/https), le quita el origen (host) y se queda con el path.
 *   Ej: "https://api.midominio.com/avatars/6.png" -> "/avatars/6.png"
 * - Si viene una ruta relativa ("avatars/6.png"), le añade "/" al principio.
 * - Colapsa barras repetidas: "///avatars//6.png" -> "/avatars/6.png"
 *
 * ¿Por qué? Para tener un formato CONSISTENTE que luego puedas
 * convertir a absoluta con environment.apiBaseUrl o servir via proxy.
 *
 * Devuelve: string (ruta normalizada empezando por '/', sin protocolo ni host).
 * Si input es falsy (null/undefined/''), devuelve ''.
 *
 * NOTA: Esta función descarta querystring y hash si la URL es absoluta.
 * Si necesitas conservar "?t=..." (cache-buster), mira la variante de abajo.
 */
export function normalizeAvatarPath(input: string): string {
  if (!input) return ''; // si no hay valor, devolvemos cadena vacía

  try {
    // Si "input" es una URL absoluta válida, "new URL" no lanza error
    const url = new URL(input);
    input = url.pathname; // nos quedamos SOLO con el path (ej: "/avatars/6.png")
    // OJO: aquí se descartan query y hash deliberadamente
  } catch {
    // Si no es una URL absoluta, asumimos que es una ruta relativa y seguimos
  }

  // Aseguramos que empiece por "/"
  let path = input.startsWith('/') ? input : `/${input}`;

  // Colapsamos // en / (salvo la primera, que ya va controlada)
  return path.replace(/\/{2,}/g, '/');
}
