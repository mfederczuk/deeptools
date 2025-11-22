/*
 * Copyright (c) 2025 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getOwnPropertyDescriptor, getPropertyKeys, isNotPrimitive, NonPrimitive } from "./_internal/utils";

const deepFreezePropertiesOfObject = <T extends NonPrimitive>(obj: T, keys: readonly (keyof T)[]) => {
	for (const key of keys) {
		const descriptor: PropertyDescriptor = getOwnPropertyDescriptor(obj, key);

		deepFreeze(descriptor.get);
		deepFreeze(descriptor.set);
		deepFreeze(descriptor.value);
	}
};

const deepFreezePrototypeExcludingConstructor = <P extends NonPrimitive>(prototype: P) => {
	const keys: (keyof P)[] = getPropertyKeys(prototype)
		.filter((key: keyof P) => (key !== "constructor"));

	deepFreezePropertiesOfObject(prototype, keys);
};

// eslint-disable-next-line @typescript-eslint/ban-types
const deepFreezeFunctionWithPrototype = <F extends Function>(func: F): Readonly<F> => {
	const keys: (keyof F)[] = getPropertyKeys(func)
		.filter((key: keyof F) => (key !== "prototype"));

	deepFreezePrototypeExcludingConstructor(func.prototype);
	deepFreezePropertiesOfObject(func, keys);

	return Object.freeze(func);
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
	if (!(isNotPrimitive(obj))) {
		return obj;
	}

	if ((typeof obj === "function") && ("prototype" in obj)) {
		return deepFreezeFunctionWithPrototype(obj);
	}

	deepFreezePropertiesOfObject(obj, getPropertyKeys(obj));

	if ((obj instanceof Map) || (obj instanceof Set)) {
		for (const [key, value] of obj.entries()) {
			deepFreeze(value);
			deepFreeze(key);
		}
	}

	return Object.freeze(obj);
}

deepFreeze(deepFreeze);

export { deepFreeze };
