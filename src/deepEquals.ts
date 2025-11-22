/*
 * Copyright (c) 2025 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getOwnPropertyDescriptor, getPropertyKeys, isNotPrimitive, NonPrimitive } from "./_internal/utils";
import { deepFreeze } from "./deepFreeze";

export type DeepEqualsOptions = {
	/**
	 * Ignores the order that the properties are defined.
	 *
	 * Default is `true`.
	 */
	ignoreOrder?: boolean;
};

const contentsEqual = (array1: unknown[], array2: unknown[], ignoreOrder: boolean): boolean => {
	const length: number = array1.length;

	if (length !== array2.length) {
		return false;
	}

	if (ignoreOrder) {
		for (let i = 0; i < length; ++i) {
			if (!(array2.includes(array1[i]))) {
				return false;
			}
		}
	} else {
		for (let i = 0; i < length; ++i) {
			if (array1[i] !== array2[i]) {
				return false;
			}
		}
	}

	return true;
};

const deepEqualPropertyDescriptor = (descriptor1: PropertyDescriptor, descriptor2: PropertyDescriptor): boolean => {
	if ((descriptor1.configurable !== descriptor2.configurable) ||
		(descriptor1.enumerable !== descriptor2.enumerable) ||
		(descriptor1.writable !== descriptor2.writable) ||
		("value" in descriptor1) !== ("value" in descriptor2)) {

		return false;
	}

	if (("value" in descriptor1) && ("value" in descriptor2)) {
		if (!(deepEquals(descriptor1.value, descriptor2.value))) {
			return false;
		}
	}

	if ((descriptor1.get !== descriptor2.get) || (descriptor1.set !== descriptor2.set)) {
		return false;
	}

	return true;
};

const deepEqualProperty = <T extends NonPrimitive>(obj1: T, obj2: T, propertyKey: keyof T): boolean => {
	const obj1PropDescriptor: PropertyDescriptor = getOwnPropertyDescriptor(obj1, propertyKey);
	const obj2PropDescriptor: PropertyDescriptor = getOwnPropertyDescriptor(obj2, propertyKey);

	return deepEqualPropertyDescriptor(obj1PropDescriptor, obj2PropDescriptor);
};

const deepEqualsInternal = <T1 extends NonPrimitive, T2 extends NonPrimitive>(
	obj1: T1,
	obj2: T2,
	options: Readonly<DeepEqualsOptions> | undefined,
): boolean => {
	const obj1Keys: (keyof T1)[] = getPropertyKeys(obj1);
	const obj2Keys: (keyof T2)[] = getPropertyKeys(obj2);

	if (!(contentsEqual(obj1Keys, obj2Keys, options?.ignoreOrder ?? true))) {
		return false;
	}

	if (Object.getPrototypeOf(obj1) !== Object.getPrototypeOf(obj2)) {
		return false;
	}

	return obj1Keys
		.every((key: keyof T1): boolean => {
			return deepEqualProperty(obj1, obj2 as unknown as T1, key);
		});
};

/**
 * Checks if **obj1** and **obj2** are equal by recursing through their properties.
 *
 * @param obj1 The first object to compare.
 * @param obj2 The second object to compare.
 * @param options Options object to change the behavior of `deepEquals`.
 *
 * @returns `true` if **obj1** and **obj2** are deeply equal, `false` if otherwise.
 */
export function deepEquals(
	obj1: unknown,
	obj2: unknown,
	options?: Readonly<DeepEqualsOptions>,
): boolean {
	if (!(isNotPrimitive(obj1)) || !(isNotPrimitive(obj2))) {
		if (Number.isNaN(obj1) && Number.isNaN(obj2)) {
			return true;
		}

		return (obj1 === obj2);
	}

	return deepEqualsInternal(obj1, obj2, options);
}
deepFreeze(deepEquals);
