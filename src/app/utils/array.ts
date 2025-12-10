
export const numberIdsToStrings = (ids: number[]) => ids.map(String);

export const stringsIdsToNumbers = (values: string[]) =>
  values.map((v) => parseInt(v, 10)).filter((n) => !Number.isNaN(n));
