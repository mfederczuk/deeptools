/*
 * Copyright (c) 2022 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { deepFreeze } from "./deepFreeze";
import { GenericKey } from "./types";
import { canValueHaveProperties, getPropertyKeys } from "./_internal/utils";

export type DeepEqualsOptions = {
	/**
	 * Ignores the order that the properties are defined.
	 *
	 * Default is `true`.
	 */
	ignoreOrder?: boolean;
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
function deepEquals(
	obj1: unknown,
	obj2: unknown,
	options?: Readonly<DeepEqualsOptions>,
): boolean {
	if (!(canValueHaveProperties(obj1)) || !(canValueHaveProperties(obj2))) {
		if (Number.isNaN(obj1) && Number.isNaN(obj2)) {
			return true;
		}

		return (obj1 === obj2);
	}

	const obj1Keys: GenericKey[] = getPropertyKeys(obj1);
	const obj2Keys: GenericKey[] = getPropertyKeys(obj2);

	if (obj1Keys.length !== obj2Keys.length) {
		return false;
	}

	if (options?.ignoreOrder !== true) {
		for (let i = 0; i < obj1Keys.length; ++i) {
			if (obj1Keys[i] !== obj2Keys[i]) {
				return false;
			}
		}
	} else {
		for (let i = 0; i < obj1Keys.length; ++i) {
			if (!(obj2Keys.includes(obj1Keys[i]))) {
				return false;
			}
		}
	}

	if (Object.getPrototypeOf(obj1) !== Object.getPrototypeOf(obj2)) {
		return false;
	}

	for (const propKey of [...obj1Keys, ...obj2Keys]) {
		const obj1PropDescriptor: PropertyDescriptor =
			(Object.getOwnPropertyDescriptor(obj1, propKey) as PropertyDescriptor);

		const obj2PropDescriptor: PropertyDescriptor =
			(Object.getOwnPropertyDescriptor(obj2, propKey) as PropertyDescriptor);

		if ((obj1PropDescriptor.configurable !== obj2PropDescriptor.configurable) ||
			(obj1PropDescriptor.enumerable !== obj2PropDescriptor.enumerable) ||
			(obj1PropDescriptor.writable !== obj2PropDescriptor.writable)) {

			return false;
		}

		if (("value" in obj1PropDescriptor) !== ("value" in obj2PropDescriptor)) {
			return false;
		}

		if (("value" in obj1PropDescriptor) && ("value" in obj2PropDescriptor)) {
			if (!(deepEquals(obj1PropDescriptor.value, obj2PropDescriptor.value))) {
				return false;
			}
		}

		if ((obj1PropDescriptor.get !== obj2PropDescriptor.get) ||
			(obj1PropDescriptor.set !== obj2PropDescriptor.set)) {

			return false;
		}
	}

	return true;
}

deepFreeze(deepEquals);

export { deepEquals };
