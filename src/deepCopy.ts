/*
 * Copyright (c) 2022 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * Creates a deep copy of **obj**.
 *
 * @param obj The object to create a deep copy of.
 *
 * @returns A deep copy of **obj**.
 */
export function deepCopy<T>(obj: T): T {
	if(typeof(obj) !== "object" || obj === null) return obj;

	if(obj instanceof Array) return obj.map(deepCopy) as unknown as T;

	const copy = {} as T;

	(Object.getOwnPropertyNames(obj) as (keyof T)[]).forEach((prop) => {
		copy[prop] = deepCopy(obj[prop]);
	});

	Object.setPrototypeOf(copy, Object.getPrototypeOf(obj));

	return copy;
}
