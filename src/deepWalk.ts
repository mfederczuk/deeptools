/*
 * Copyright (c) 2023 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { NonEmptyArray, NonPrimitive, getPropertyKeys, isNonPrimitive } from "./_internal/utils";
import { deepFreeze } from "./deepFreeze";
import type { GenericKey } from "./types";

export type KeyPath = NonEmptyArray<GenericKey>;

export type PropertyVisitorFunc = (
	path: KeyPath,
	value: unknown,
	parentObject: unknown,
	descriptor: PropertyDescriptor,
	rootObject: unknown,
) => void;

export type DeepWalkOptions = {
	/**
	 * Before visiting an object, visit all of its properties.
	 *
	 * Default value is `false`.
	 */
	depth?: boolean;
};

const deepWalkInternal = <T>(
	keyPath: GenericKey[],
	obj: T,
	visitorFunc: PropertyVisitorFunc,
	options: (Readonly<DeepWalkOptions> | undefined),
	rootObject: unknown,
): void => {
	if (!(isNonPrimitive(obj))) {
		return;
	}

	for (const key of getPropertyKeys<T & NonPrimitive>(obj)) {
		const depth: boolean = (options?.depth === true);

		const newKeyPath: KeyPath = [...keyPath, key];

		const value: unknown = obj[key];

		const descriptor: PropertyDescriptor = (Object.getOwnPropertyDescriptor(obj, key) as PropertyDescriptor);

		const visit = ((): void => visitorFunc(newKeyPath, value, obj, descriptor, rootObject));

		if (!depth) {
			visit();
		}

		deepWalkInternal(
			newKeyPath,
			value,
			visitorFunc,
			options,
			rootObject,
		);

		if (depth) {
			visit();
		}
	}
};

/**
 * Recursively walks through **obj**.
 *
 * ### This is an experimental function, use with caution. ###
 *
 * @param obj The object to walk through.
 * @param visitorFunc The visitor callback function to call on every property.
 * @param options Options object to change the behavior of `deepWalk`.
 */
export function deepWalk(
	obj: unknown,
	visitorFunc: PropertyVisitorFunc,
	options?: Readonly<DeepWalkOptions>,
): void {
	return deepWalkInternal([], obj, visitorFunc, options, obj);
}
deepFreeze(deepWalk);
