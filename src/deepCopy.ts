/*
 * Copyright (c) 2025 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getOwnPropertyDescriptor, getPropertyKeys, isNotPrimitive } from "./_internal/utils";
import { deepFreeze } from "./deepFreeze";

const scalarArrayTypesWithout64BitInts = [
	Int8Array,
	Uint8Array,
	Uint8ClampedArray,

	Int16Array,
	Uint16Array,

	Int32Array,
	Uint32Array,

	Float32Array,
	Float64Array,
] as const;

const uncopiableTypes = [
	[WeakMap, "WeakMap"],
	[WeakSet, "WeakSet"],
	[SharedArrayBuffer, "SharedArrayBuffer"],
	[DataView, "DataView"],
	[Promise, "Promise"],
] as const;

const initCopyOfScalarArrays = (obj: NonNullable<object>): NonNullable<object> | null => {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	for (const ScalarArray of scalarArrayTypesWithout64BitInts) {
		if (obj instanceof ScalarArray) {
			// TypeScript rejects this if the 64-bit integer arrays are added.
			return new ScalarArray(obj);
		}
	}

	if (obj instanceof BigInt64Array) {
		return new BigInt64Array(obj);
	}

	if (obj instanceof BigUint64Array) {
		return new BigUint64Array(obj);
	}

	return null;
};

const throwIfIsUncopiableType = (obj: unknown): void | never => {
	for (const [uncopiableType, typeName] of uncopiableTypes) {
		if (obj instanceof uncopiableType) {
			throw new TypeError(`${typeName} objects cannot be copied`);
		}
	}
};

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

	const scalarArrayCopyOrNull: NonNullable<object> | null = initCopyOfScalarArrays(obj);
	if (scalarArrayCopyOrNull !== null) {
		return scalarArrayCopyOrNull;
	}

	if (obj instanceof ArrayBuffer) {
		const newBuffer = new ArrayBuffer(obj.byteLength);

		const origView = new Uint8Array(obj);
		const newView = new Uint8Array(newBuffer);
		newView.set(origView);

		return newBuffer;
	}

	throwIfIsUncopiableType(obj);

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
	if (!(isNotPrimitive(obj))) {
		return obj;
	}

	if (typeof obj === "function") {
		throw new TypeError("Function objects cannot be copied");
	}

	const copy: NonNullable<object> = initCopy(obj);

	for (const propertyKey of getPropertyKeys(obj)) {
		const propertyDescriptor: PropertyDescriptor = getOwnPropertyDescriptor(obj, propertyKey);

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
