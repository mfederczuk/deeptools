/*
 * Copyright (c) 2022 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { GenericKey } from "./types";
import { canValueHaveProperties, getPropertyKeys } from "./_internal/utils";

const deepFreezePrototypeExcludingConstructor = (prototype: Record<GenericKey, unknown>) => {
	const keys: GenericKey[] = getPropertyKeys(prototype)
		.filter((key: GenericKey) => (key !== "constructor"));

	for(const key of keys) {
		deepFreeze((prototype[key]));
	}
};

deepFreeze(deepFreezePrototypeExcludingConstructor);

// eslint-disable-next-line @typescript-eslint/ban-types
const deepFreezeFunctionWithPrototype = <F extends Function>(func: F): Readonly<F> => {
	const keys: GenericKey[] = getPropertyKeys(func)
		.filter((key: GenericKey) => (key !== "prototype"));

	deepFreezePrototypeExcludingConstructor(func.prototype);

	for(const key of keys) {
		deepFreeze((func as Record<GenericKey, unknown>)[key]);
	}

	return Object.freeze(func);
};

deepFreeze(deepFreezeFunctionWithPrototype);

/**
 * Recursively freezes **arr** and all of its items & other properties.
 *
 * @param arr The 3-dimensional array to freeze.
 *
 * @returns **arr**, deeply frozen.
 */
function deepFreeze<T>(arr: readonly (readonly (readonly T[])[])[]): readonly (readonly (readonly Readonly<T>[])[])[];

/**
 * Recursively freezes **arr** and all of its items & other properties.
 *
 * @param arr The 2-dimensional array to freeze.
 *
 * @returns **arr**, deeply frozen.
 */
function deepFreeze<T>(arr: readonly (readonly T[])[]): readonly (readonly Readonly<T>[])[];

/**
 * Recursively freezes **arr** and all of its items & other properties.
 *
 * @param arr The 1-dimensional array to freeze.
 *
 * @returns **arr**, deeply frozen.
 */
function deepFreeze<T>(arr: readonly T[]): readonly Readonly<T>[];

/**
 * Recursively freezes **obj** and all of its properties.
 *
 * @param obj The object to freeze.
 *
 * @returns **obj**, deeply frozen.
 */
function deepFreeze<T>(obj: T): Readonly<T>;

function deepFreeze<T>(obj: T): Readonly<T> {
	if(!(canValueHaveProperties(obj))) {
		return obj;
	}

	if((typeof obj === "function") && ("prototype" in obj)) {
		return deepFreezeFunctionWithPrototype(obj);
	}

	for(const key of getPropertyKeys(obj)) {
		deepFreeze((obj as Record<GenericKey, unknown>)[key]);
	}

	if((obj instanceof Map) || (obj instanceof Set)) {
		for(const [key, value] of obj.entries()) {
			deepFreeze(value);
			deepFreeze(key);
		}
	}

	return Object.freeze(obj);
}

deepFreeze(deepFreeze);

export { deepFreeze };
