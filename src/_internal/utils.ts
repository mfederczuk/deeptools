/*
 * Copyright (c) 2025 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export type NonEmptyArray<T> = ([T, ...T[]] | [...T[], T]);

// eslint-disable-next-line @typescript-eslint/ban-types
export type NonPrimitive = NonNullable<object | Function>;

export function isNotPrimitive(value: unknown): value is NonPrimitive {
	return (((typeof value === "object") && (value !== null)) ||
	        (typeof value === "function"));
}

export function getPropertyKeys<T extends NonPrimitive>(obj: T): (keyof T)[] {
	return [
		...(Object.getOwnPropertyNames(obj)),
		...(Object.getOwnPropertySymbols(obj)),
	] as (keyof T)[];
}

export function getOwnPropertyDescriptor<T extends NonPrimitive>(
	object: T,
	propertyKey: keyof T,
): PropertyDescriptor {
	const descriptor: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(object, propertyKey);

	if (descriptor === undefined) {
		throw new TypeError("Object.getOwnPropertyDescriptor() unexpectedly returned `undefined`");
	}

	return descriptor;
}
