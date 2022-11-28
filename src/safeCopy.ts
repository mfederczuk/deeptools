/*
 * Copyright (c) 2020 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { deepCopy } from "./deepCopy";
import { deepFreeze } from "./deepFreeze";

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

export { safeCopy };
