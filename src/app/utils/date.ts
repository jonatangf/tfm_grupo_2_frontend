

/**
 * Convierte cualquier valor (fecha en string, Date, timestamp, etc.) 
 * en el formato compatible con inputs HTML tipo "date" (YYYY-MM-DD).
 *
 * - Si el valor es nulo o vacío, devuelve `null`.
 * - Si el valor no es una fecha válida, devuelve `null`.
 * - Si es válido, devuelve la parte de fecha del ISO string (ej. "2025-12-10").
 *
 * Uso típico: para mostrar fechas en <input type="date">, que requiere este formato.
 *
 * @param value Valor a convertir (puede ser string, Date, número, etc.)
 * @returns string con formato "YYYY-MM-DD" o null si no es válido.
 */

export const toDateInputFormat = (value: unknown): string | null => {
  if (!value) return null;
  const d = new Date(value as any);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
};
