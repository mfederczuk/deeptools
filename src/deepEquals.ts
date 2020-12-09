/*
 * A set of utility functions that recursively operate on objects.
 * Copyright (C) 2020 Michael Federczuk
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

/* eslint-disable @typescript-eslint/ban-types */

/**
 * Checks if **obj1** and **obj2** are equal by recursing through their
 * properties.
 *
 * @param obj1
 *        The first object to compare.
 *
 * @param obj2
 *        The second object to compare.
 *
 * @returns `true` if **obj1** and **obj2** are deeply equal, `false` if
 *          otherwise.
 */
export default function deepEquals(obj1: unknown, obj2: unknown): boolean {
	if(typeof(obj1) !== "object" || obj1 === null ||
	   typeof(obj2) !== "object" || obj2 === null) {
		return obj1 === obj2;
	}

	if(obj1 instanceof Array || obj2 instanceof Array) {
		if(!(obj1 instanceof Array) || !(obj2 instanceof Array)) return false;

		const s = obj1.length;
		if(s !== obj2.length) return false;

		for(let i = 0; i < s; ++i) {
			if(!deepEquals(obj1[i], obj2[i])) return false;
		}

		return true;
	}

	const props = [
		...(Object.getOwnPropertyNames(obj1) as (keyof object)[]),
		...(Object.getOwnPropertyNames(obj2) as (keyof object)[])
	];

	for(const prop of props) {
		if(!deepEquals(obj1[prop], obj2[prop])) return false;
	}

	return true;
}
