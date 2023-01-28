/*
 * Copyright (c) 2022 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { deepCopy } from "./deepCopy";
import { deepFreeze } from "./deepFreeze";

/**
 * Creates a deep copy of **arr** that is also deeply frozen.
 *
 * @param arr The 3-dimensional array to create a deeply frozen copy of.
 *
 * @returns A deeply frozen copy of **arr**.
 *
 * @see {@link deepCopy}
 * @see {@link deepFreeze}
 */
function safeCopy<T>(arr: readonly (readonly (readonly T[])[])[]): readonly (readonly (readonly Readonly<T>[])[])[];

/**
 * Creates a deep copy of **arr** that is also deeply frozen.
 *
 * @param arr The 2-dimensional array to create a deeply frozen copy of.
 *
 * @returns A deeply frozen copy of **arr**.
 *
 * @see {@link deepCopy}
 * @see {@link deepFreeze}
 */
function safeCopy<T>(arr: readonly (readonly T[])[]): readonly (readonly Readonly<T>[])[];

/**
 * Creates a deep copy of **arr** that is also deeply frozen.
 *
 * @param arr The 1-dimensional array to create a deeply frozen copy of.
 *
 * @returns A deeply frozen copy of **arr**.
 *
 * @see {@link deepCopy}
 * @see {@link deepFreeze}
 */
function safeCopy<T>(arr: readonly T[]): readonly Readonly<T>[];

/**
 * Creates a deep copy of **obj** that is also deeply frozen.
 *
 * @param obj The object to create a deeply frozen copy of.
 *
 * @returns A deeply frozen copy of **obj**.
 *
 * @see {@link deepCopy}
 * @see {@link deepFreeze}
 */
function safeCopy<T>(obj: T): Readonly<T>;

function safeCopy<T>(obj: T): Readonly<T> {
	return deepFreeze(deepCopy(obj));
}

deepFreeze(safeCopy);

export { safeCopy };
