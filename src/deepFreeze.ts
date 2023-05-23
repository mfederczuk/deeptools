/*
 * Copyright (c) 2023 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { NonPrimitive, getPropertyKeys, isNonPrimitive } from "./_internal/utils";

const deepFreezeKeysOfObject = <T extends NonPrimitive>(obj: T, keys: readonly (keyof T)[]): void => {
	for (const key of keys) {
		const descriptor: PropertyDescriptor = (Object.getOwnPropertyDescriptor(obj, key) as PropertyDescriptor);

		deepFreezeInternal(descriptor.get);
		deepFreezeInternal(descriptor.set);
		deepFreezeInternal(descriptor.value);
	}
};

const deepFreezePrototypeExcludingConstructor = <P extends NonPrimitive>(prototype: P): void => {
	const keys: (keyof P)[] = getPropertyKeys<P>(prototype)
		.filter((key: (keyof P)) => (key !== "constructor"));

	deepFreezeKeysOfObject(prototype, keys);
};

// eslint-disable-next-line @typescript-eslint/ban-types
const deepFreezeFunctionWithPrototype = <F extends Function>(func: F): Readonly<F> => {
	const keys: (keyof F)[] = getPropertyKeys<F>(func)
		.filter((key: (keyof F)) => (key !== "prototype"));

	deepFreezePrototypeExcludingConstructor(func.prototype);
	deepFreezeKeysOfObject(func, keys);

	return Object.freeze(func);
};

const deepFreezeInternal = <T>(obj: T): Readonly<T> => {
	if (!(isNonPrimitive(obj))) {
		return obj;
	}

	if ((typeof obj === "function") && ("prototype" in obj)) {
		return deepFreezeFunctionWithPrototype(obj);
	}

	deepFreezeKeysOfObject(
		obj,
		getPropertyKeys<T & object>(obj),
	);

	if ((obj instanceof Map) || (obj instanceof Set)) {
		for (const [key, value] of obj.entries()) {
			deepFreezeInternal(value);
			deepFreezeInternal(key);
		}
	}

	return Object.freeze(obj);
};


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
	return deepFreezeInternal(obj);
}

deepFreeze(deepFreeze);

export { deepFreeze };
