
/*
* Metodos conversores de Arrays de enteros a texto y vicebersa (para Ids numéricos)
*/

export const numberIdsToStrings = (ids: number[]) => ids.map(String);

export const stringsIdsToNumbers = (values: string[]) =>
  values.map((v) => parseInt(v, 10)).filter((n) => !Number.isNaN(n));
