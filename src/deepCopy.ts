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
 * Creates a deep copy of **obj**.
 *
 * @param obj
 *        The object to create a deep copy of.
 *
 * @returns A deep copy of **obj**.
 */
export default function deepCopy<T>(obj: T): T {
	if(typeof(obj) !== "object" || obj === null) return obj;

	if(obj instanceof Array) return obj.map(deepCopy) as unknown as T;

	const copy = {} as T;

	(Object.getOwnPropertyNames(obj) as (keyof T)[]).forEach((prop) => {
		copy[prop] = deepCopy(obj[prop]);
	});

	Object.setPrototypeOf(copy, Object.getPrototypeOf(obj));

	return copy;
}
