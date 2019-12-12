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
 * Creates a deep copy of **obj**.
 *
 * @param obj
 *        The object to create a deep copy of.
 *
 * @returns A deep copy of **obj**.
 */
module.exports = function deepCopy(obj) {
	"use strict";

	if(typeof(obj) === "undefined" ||
	   obj === null ||
	   typeof(obj) === "boolean" ||
	   typeof(obj) === "number" ||
	   typeof(obj) === "string" ||
	   typeof(obj) === "symbol" ||
	   typeof(obj) === "function") return obj;

	if(obj instanceof Array) {
		const copy = [];

		const s = obj.length;
		for(let i = 0; i < s; ++i) {
			copy[i] = deepCopy(obj[i]);
		}

		return copy;
	}

	const copy = {};

	for(const prop of Object.getOwnPropertyNames(obj)) {
		copy[prop] = deepCopy(obj[prop]);
	}

	Object.setPrototypeOf(copy, Object.getPrototypeOf(obj));

	return copy;
}
