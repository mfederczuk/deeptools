/* jshint esversion: 6 */
/*
 * A set of utility functions that recursively operate on objects.
 * Copyright (C) 2019 Michael Federczuk
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
export default function deepEquals(obj1, obj2) {
	"use strict";

	if(typeof(obj1) === "undefined") {
		return typeof(obj2) === "undefined";
	}
	if(obj1 === null) {
		return obj2 === null;
	}
	if(typeof(obj1) === "boolean") {
		return typeof(obj2) === "boolean" && obj1 === obj2;
	}
	if(typeof(obj1) === "number") {
		return typeof(obj2) === "number" && obj1 === obj2;
	}
	if(typeof(obj1) === "string") {
		return typeof(obj2) === "string" && obj1 === obj2;
	}
	if(typeof(obj1) === "symbol") {
		return typeof(obj2) === "symbol" && obj1 === obj2;
	}
	if(typeof(obj1) == "function") {
		return typeof(obj2) === "function" && obj1 === obj2;
	}

	if(obj1 instanceof Array) {
		if(!(obj2 instanceof Array)) return false;

		const s = obj1.length;
		if(s !== obj2.length) return false;

		for(let i = 0; i < s; ++i) {
			if(!deepEquals(obj1[i], obj2[i])) return false;
		}

		return true;
	}

	const props = [
		...Object.getOwnPropertyNames(obj1),
		...Object.getOwnPropertyNames(obj2)
	];

	for(const prop of props) {
		if(!deepEquals(obj1[prop], obj2[prop])) return false;
	}

	return true;
}
