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
 * Recursively freezes **obj** with all of its properties.
 *
 * @param obj
 *        The object to freeze.
 *
 * @returns **obj**, deeply frozen.
 */
module.exports = function deepFreeze(obj) {
	"use strict";

	if(typeof(obj) !== "undefined" &&
	   obj !== null &&
	   typeof(obj) !== "boolean" &&
	   typeof(obj) !== "number" &&
	   typeof(obj) !== "string" &&
	   typeof(obj) !== "function") {

		for(const prop of Object.getOwnPropertyNames(obj)) {
			deepFreeze(obj[prop]);
		}
	}

	return Object.freeze(obj);
};
