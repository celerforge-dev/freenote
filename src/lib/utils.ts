import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function objEnum<T extends string>(enumValues: readonly T[]) {
  const enumObject = {} as { [K in T]: K };
  for (const enumValue of enumValues) {
    enumObject[enumValue] = enumValue;
  }
  return enumObject;
}
