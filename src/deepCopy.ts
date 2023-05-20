/*
 * Copyright (c) 2023 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { deepFreeze } from "./deepFreeze";
import { canValueHaveProperties, getPropertyKeys } from "./_internal/utils";

const initCopy = (obj: NonNullable<object>): NonNullable<object> => {
	// <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects>
	// these objects all seem to have some special built-in property that cannot be copied over after creation, so we
	// need to have special cases to create them

	if (obj instanceof Array) return new Array(obj.map(deepCopy));

	if (obj instanceof RegExp) return new RegExp(obj);

	if (obj instanceof Date) return new Date(obj);

	if (obj instanceof Map) {
		const copiedEntries: [unknown, unknown][] = [];

		for (const [key, value] of obj.entries()) {
			copiedEntries.push([deepCopy(key), deepCopy(value)]);
		}

		return new Map(copiedEntries);
	}

	if (obj instanceof Set) {
		const copiedValues: unknown[] = [];

		for (const value of obj.values()) {
			copiedValues.push(deepCopy(value));
		}

		return new Set(copiedValues);
	}

	//#region scalar arrays

	if (obj instanceof Int8Array) return new Int8Array(obj);
	if (obj instanceof Uint8Array) return new Uint8Array(obj);
	if (obj instanceof Uint8ClampedArray) return new Uint8ClampedArray(obj);

	if (obj instanceof Int16Array) return new Int16Array(obj);
	if (obj instanceof Uint16Array) return new Uint16Array(obj);

	if (obj instanceof Int32Array) return new Int32Array(obj);
	if (obj instanceof Uint32Array) return new Uint32Array(obj);

	if (obj instanceof Float32Array) return new Float32Array(obj);
	if (obj instanceof Float64Array) return new Float64Array(obj);

	if (obj instanceof BigInt64Array) return new BigInt64Array(obj);
	if (obj instanceof BigUint64Array) return new BigUint64Array(obj);

	//#endregion

	if (obj instanceof ArrayBuffer) {
		const newBuffer = new ArrayBuffer(obj.byteLength);

		const origView = new Uint8Array(obj);
		const newView = new Uint8Array(newBuffer);
		newView.set(origView);

		return newBuffer;
	}

	//#region

	if (obj instanceof WeakMap) throw new TypeError("WeakMap objects cannot be copied");
	if (obj instanceof WeakSet) throw new TypeError("WeakSet objects cannot be copied");

	if (obj instanceof SharedArrayBuffer) throw new TypeError("SharedArrayBuffer objects cannot be copied");

	if (obj instanceof DataView) throw new TypeError("DataView objects cannot be copied");

	if (obj instanceof Promise) throw new TypeError("Promise objects cannot be copied");

	//#endregion

	return Object.create(obj);
};

/**
 * Creates a deep copy of **obj**.
 *
 * @param obj The object to create a deep copy of.
 *
 * @returns A deep copy of **obj**.
 */
export function deepCopy<T>(obj: T): T {
	if (!(canValueHaveProperties(obj))) {
		return obj;
	}

	if (typeof obj === "function") {
		throw new TypeError("Function objects cannot be copied");
	}

	const copy: NonNullable<object> = initCopy(obj);

	for (const propertyKey of getPropertyKeys(obj)) {
		const propertyDescriptor: PropertyDescriptor =
			(Object.getOwnPropertyDescriptor(obj, propertyKey) as PropertyDescriptor);

		if ("value" in propertyDescriptor) {
			propertyDescriptor.value = deepCopy(propertyDescriptor.value);
		}

		Object.defineProperty(copy, propertyKey, propertyDescriptor);
	}

	// <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf>
	// Mozilla recommends not using Object.setPrototypeOf for performance reasons, so we put at least put it behind a
	// conditional
	const objPrototype: (object | null) = Object.getPrototypeOf(obj);
	if (Object.getPrototypeOf(copy) !== objPrototype) {
		Object.setPrototypeOf(copy, objPrototype);
	}

	return (copy as T);
}
deepFreeze(deepCopy);
