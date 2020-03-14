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

import deepCopy from "./deepCopy";
import deepFreeze from "./deepFreeze";

/**
 * Creates a safe copy of **arr** by creating a deep frozen copy of it.
 *
 * @param arr
 *        The array to create a safe copy of.
 *
 * @returns A safe copy of **arr**.
 */
function safeCopy<T>(arr: T[][]): readonly (readonly Readonly<T>[])[];

/**
 * Creates a safe copy of **arr** by creating a deep frozen copy of it.
 *
 * @param arr
 *        The array to create a safe copy of.
 *
 * @returns A safe copy of **arr**.
 */
function safeCopy<T>(arr: T[]): readonly Readonly<T>[];

/**
 * Creates a safe copy of **obj** by creating a deep frozen copy of it.
 *
 * @param obj
 *        The object to create a safe copy of.
 *
 * @returns A safe copy of **obj**.
 */
function safeCopy<T>(obj: T): Readonly<T>;

function safeCopy<T>(obj: (T[][] | T[] | T)): (readonly (readonly Readonly<T>[])[] | readonly Readonly<T>[] | Readonly<T>) {
	return deepFreeze(deepCopy(obj));
}

export default safeCopy;
