/*
 * Copyright (c) 2025 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { NullWeakSet } from "./_internal/NullWeakSet";
import { getOwnPropertyDescriptor, getPropertyKeys, isNotPrimitive, NonPrimitive } from "./_internal/utils";

export interface DeepFreezeOptions {
	/**
	 * Detects circular references in objects and avoids infinite recursion.
	 *
	 * Default is `false`.
	 */
	mindCircularReferences?: boolean;
}

const deepFreezePropertiesOfObject = <T extends NonPrimitive>(
	obj: T,
	keys: readonly (keyof T)[],
	frozenObjects: WeakSet<NonPrimitive>
): void => {
	for (const key of keys) {
		const descriptor: PropertyDescriptor = getOwnPropertyDescriptor(obj, key);

		// eslint-disable-next-line @typescript-eslint/unbound-method
		deepFreezeInternal(descriptor.get, frozenObjects);
		// eslint-disable-next-line @typescript-eslint/unbound-method
		deepFreezeInternal(descriptor.set, frozenObjects);
		deepFreezeInternal(descriptor.value, frozenObjects);
	}
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
const deepFreezePrototypeExcludingConstructor = <P extends NonPrimitive>(
	prototype: P,
	frozenObjects: WeakSet<NonPrimitive>
): void => {
	const keys: (keyof P)[] = getPropertyKeys(prototype)
		.filter((key: keyof P) => (key !== "constructor"));

	deepFreezePropertiesOfObject(prototype, keys, frozenObjects);
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const deepFreezeFunctionWithPrototype = <F extends Function>(
	func: F,
	frozenObjects: WeakSet<NonPrimitive>
): Readonly<F> => {
	const keys: (keyof F)[] = getPropertyKeys(func)
		.filter((key: keyof F) => (key !== "prototype"));

	deepFreezePrototypeExcludingConstructor(func.prototype, frozenObjects);
	deepFreezePropertiesOfObject(func, keys, frozenObjects);

	return Object.freeze(func);
};

const deepFreezeInternal = <T>(obj: T, frozenObjects: WeakSet<NonPrimitive>): Readonly<T> => {
	if (!(isNotPrimitive(obj))) {
		return obj;
	}

	if (frozenObjects.has(obj)) {
		return obj;
	}
	frozenObjects.add(obj);

	if ((typeof obj === "function") && ("prototype" in obj)) {
		return deepFreezeFunctionWithPrototype(obj, frozenObjects);
	}

	deepFreezePropertiesOfObject(obj, getPropertyKeys(obj), frozenObjects);

	if ((obj instanceof Map) || (obj instanceof Set)) {
		for (const [key, value] of obj.entries()) {
			deepFreezeInternal(value, frozenObjects);
			deepFreezeInternal(key, frozenObjects);
		}
	}

	return Object.freeze(obj);
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
