


/**
 * buildInterestMap(items)
 * ---------------------------------------------------------
 * ¿Qué hace? Convierte un array de objetos (cada uno con "id") en un Map
 *            donde la clave es el id y el valor es el objeto completo.
 * ¿Por qué? Para poder buscar por id en O(1) (rápido), en lugar de recorrer el array.
 * Ejemplo: [{id: 2, name: 'Surf'}] -> Map { 2 => {id: 2, name: 'Surf'} }
 */
export function buildInterestMap<T extends { id: number }>(items: T[]): Map<number, T> {
  const map = new Map<number, T>();
  // items ?? [] asegura que si items es null/undefined, itere sobre [] (nada)
  for (const i of items ?? []) {
    map.set(i.id, i); // clave = id, valor = objeto
  }
  return map;
}

/**
 * pickInterestsByIds(ids, map)
 * ---------------------------------------------------------
 * ¿Qué hace? A partir de una lista de ids y un Map (id -> objeto),
 *            devuelve solo los objetos cuyos ids existen en el Map.
 * ¿Por qué? Para transformar ids (números) en los objetos "interés" reales.
 * Detalle: si algún id no está en el Map, se filtra (no devuelve undefined).
 */
export function pickInterestsByIds<T extends { id: number }>(
  ids: number[],
  map: Map<number, T>
): T[] {
  return ids
    .map((id) => map.get(id))
    .filter((x): x is T => !!x); // type guard: deja solo valores T (no undefined)
}

