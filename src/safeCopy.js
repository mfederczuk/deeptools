/* jshint esversion: 6 */
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

const deepCopy = require("./deepCopy");
const deepFreeze = require("./deepFreeze");

/**
 * Creates a safe copy of **obj** by creating a deep frozen copy of it.
 *
 * @param obj
 *        The object to create a safe copy of.
 *
 * @returns A safe copy of **obj**.
 */
module.exports = function safeCopy(obj) {
	"use strict";
	return deepFreeze(deepCopy(obj));
};
