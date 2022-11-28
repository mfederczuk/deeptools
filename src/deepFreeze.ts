/*
 * Copyright (c) 2022 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * Recursively freezes **arr**, all of **arr**'s items and all items of
 *  **arr**'s items.
 *
 * @param arr
 *        The array to freeze.
 *
 * @returns **arr**, deeply frozen.
 */
function deepFreeze<T>(arr: T[][]): readonly (readonly Readonly<T>[])[];

/**
 * Recursively freezes **arr** and all of its items.
 *
 * @param arr
 *        The array to freeze.
 *
 * @returns **arr**, deeply frozen.
 */
function deepFreeze<T>(arr: T[]): readonly Readonly<T>[];

/**
 * Recursively freezes **obj** and all of its properties.
 *
 * @param obj
 *        The object to freeze.
 *
 * @returns **obj**, deeply frozen.
 */
function deepFreeze<T>(obj: T): Readonly<T>;

function deepFreeze<T>(obj: (T[][] | T[] | T)): (readonly (readonly Readonly<T>[])[] | readonly Readonly<T>[] | Readonly<T>) {
	if(typeof(obj) !== "object" || obj === null) return obj;

	(Object.getOwnPropertyNames(obj) as ((keyof T[][] & keyof T[] & keyof T)[])).forEach((prop) => {
		deepFreeze(obj[prop]);
	});

	return Object.freeze(obj);
}

export { deepFreeze };
