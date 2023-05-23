/*
 * Copyright (c) 2023 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { NullWeakSet } from "./_internal/NullWeakSet";
import { NonPrimitive, getPropertyKeys, isNonPrimitive } from "./_internal/utils";

const deepFreezeKeysOfObject = <T extends NonPrimitive>(
	obj: T,
	keys: readonly (keyof T)[],
	frozenObjects: WeakSet<NonPrimitive>,
): void => {
	for (const key of keys) {
		const descriptor: PropertyDescriptor = (Object.getOwnPropertyDescriptor(obj, key) as PropertyDescriptor);

		deepFreezeInternal(descriptor.get, frozenObjects);
		deepFreezeInternal(descriptor.set, frozenObjects);
		deepFreezeInternal(descriptor.value, frozenObjects);
	}
};

const deepFreezePrototypeExcludingConstructor = <P extends NonPrimitive>(
	prototype: P,
	frozenObjects: WeakSet<NonPrimitive>,
): void => {
	const keys: (keyof P)[] = getPropertyKeys<P>(prototype)
		.filter((key: (keyof P)) => (key !== "constructor"));

	deepFreezeKeysOfObject(prototype, keys, frozenObjects);
};

// eslint-disable-next-line @typescript-eslint/ban-types
const deepFreezeFunctionWithPrototype = <F extends Function>(
	func: F,
	frozenObjects: WeakSet<NonPrimitive>,
): Readonly<F> => {
	const keys: (keyof F)[] = getPropertyKeys<F>(func)
		.filter((key: (keyof F)) => (key !== "prototype"));

	deepFreezePrototypeExcludingConstructor(func.prototype, frozenObjects);
	deepFreezeKeysOfObject(func, keys, frozenObjects);

	return Object.freeze(func);
};

const deepFreezeInternal = <T>(obj: T, frozenObjects: WeakSet<NonPrimitive>): Readonly<T> => {
	if (!(isNonPrimitive(obj))) {
		return obj;
	}

	if (frozenObjects.has(obj)) {
		return obj;
	}
	frozenObjects.add(obj);

	if ((typeof obj === "function") && ("prototype" in obj)) {
		return deepFreezeFunctionWithPrototype(obj, frozenObjects);
	}

	deepFreezeKeysOfObject(
		obj,
		getPropertyKeys<T & object>(obj),
		frozenObjects,
	);

	if ((obj instanceof Map) || (obj instanceof Set)) {
		for (const [key, value] of obj.entries()) {
			deepFreezeInternal(value, frozenObjects);
			deepFreezeInternal(key, frozenObjects);
		}
	}

	return Object.freeze(obj);
};

export type DeepFreezeOptions = {
	/**
	 * Detects circular references in objects and avoids infinite recursion.
	 *
	 * Default is `false`.
	 */
	mindCircularReferences?: boolean;
};

/**
 * Recursively freezes **arr** and all of its items & other properties.
 *
 * @param arr The 3-dimensional array to freeze.
 * @param options Options to change the behavior of `deepFreeze`.
 *
 * @returns **arr**, deeply frozen.
 */
function deepFreeze<T>(
	arr: readonly (readonly (readonly T[])[])[],
	options?: Readonly<DeepFreezeOptions>,
): readonly (readonly (readonly Readonly<T>[])[])[];

/**
 * Recursively freezes **arr** and all of its items & other properties.
 *
 * @param arr The 2-dimensional array to freeze.
 * @param options Options to change the behavior of `deepFreeze`.
 *
 * @returns **arr**, deeply frozen.
 */
function deepFreeze<T>(
	arr: readonly (readonly T[])[],
	options?: Readonly<DeepFreezeOptions>,
): readonly (readonly Readonly<T>[])[];

/**
 * Recursively freezes **arr** and all of its items & other properties.
 *
 * @param arr The 1-dimensional array to freeze.
 * @param options Options to change the behavior of `deepFreeze`.
 *
 * @returns **arr**, deeply frozen.
 */
function deepFreeze<T>(
	arr: readonly T[],
	options?: Readonly<DeepFreezeOptions>,
): readonly Readonly<T>[];

/**
 * Recursively freezes **obj** and all of its properties.
 *
 * @param obj The object to freeze.
 * @param options Options to change the behavior of `deepFreeze`.
 *
 * @returns **obj**, deeply frozen.
 */
function deepFreeze<T>(obj: T, options?: Readonly<DeepFreezeOptions>): Readonly<T>;

function deepFreeze<T>(obj: T, options?: Readonly<DeepFreezeOptions>): Readonly<T> {
	let frozenObjects: WeakSet<object>;
	if (options?.mindCircularReferences === true) {
		frozenObjects = new WeakSet();
	} else {
		frozenObjects = new NullWeakSet();
	}

	return deepFreezeInternal(obj, frozenObjects);
}

deepFreeze(deepFreeze);

export { deepFreeze };
