/*
 * A set of utility functions that recursively operate on objects.
 * Copyright (C) 2020  Michael Federczuk
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
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

export default deepFreeze;
