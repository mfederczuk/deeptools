/*
 * Copyright (c) 2022 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * Recursively freezes **arr** and all of its items & other properties.
 *
 * @param arr The 3-dimensional array to freeze.
 *
 * @returns **arr**, deeply frozen.
 */
function deepFreeze<T>(arr: readonly (readonly (readonly T[])[])[]): readonly (readonly (readonly Readonly<T>[])[])[];

/**
 * Recursively freezes **arr** and all of its items & other properties.
 *
 * @param arr The 2-dimensional array to freeze.
 *
 * @returns **arr**, deeply frozen.
 */
function deepFreeze<T>(arr: readonly (readonly T[])[]): readonly (readonly Readonly<T>[])[];

/**
 * Recursively freezes **arr** and all of its items & other properties.
 *
 * @param arr The 1-dimensional array to freeze.
 *
 * @returns **arr**, deeply frozen.
 */
function deepFreeze<T>(arr: readonly T[]): readonly Readonly<T>[];

/**
 * Recursively freezes **obj** and all of its properties.
 *
 * @param obj The object to freeze.
 *
 * @returns **obj**, deeply frozen.
 */
function deepFreeze<T>(obj: T): Readonly<T>;

function deepFreeze<T>(obj: T): Readonly<T> {
	if(typeof(obj) !== "object" || obj === null) return obj;

	(Object.getOwnPropertyNames(obj) as ((keyof T[][] & keyof T[] & keyof T)[])).forEach((prop) => {
		deepFreeze(obj[prop]);
	});

	return Object.freeze(obj);
}

export { deepFreeze };
