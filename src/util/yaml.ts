import { parse, stringify } from "yaml";

export function parseYAML<T = unknown>(yamlStr: string): T {
  return parse(yamlStr) as T;
}

export function serializeYAML<T = unknown>(obj: T): string {
  return stringify(obj, { indent: 2 });
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function setByPath(obj: any, path: string[], value: any): any {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  return {
    ...obj,
    [head]: setByPath(obj?.[head] ?? {}, rest, value),
  };
}

export function deleteByPath(obj: any, path: string[]): any {
  if (path.length === 0) return obj;

  const [head, ...rest] = path;

  if (rest.length === 0) {
    const { [head]: _, ...restObj } = obj;
    return restObj;
  }

  return {
    ...obj,
    [head]: deleteByPath(obj[head] ?? {}, rest),
  };
}
