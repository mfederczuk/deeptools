/*
 * Copyright (c) 2025 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getOwnPropertyDescriptor, getPropertyKeys, isNotPrimitive, NonEmptyArray } from "./_internal/utils";
import { deepFreeze } from "./deepFreeze";

export type KeyPath = NonEmptyArray<PropertyKey>;

export type PropertyVisitorFunc = (
	path: KeyPath,
	value: unknown,
	parentObject: unknown,
	descriptor: PropertyDescriptor,
	rootObject: unknown,
) => void;

export interface DeepWalkOptions {
	/**
	 * Before visiting an object, visit all of its properties.
	 *
	 * Default value is `false`.
	 */
	depth?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
const deepWalkInternal = <T>(
	keyPath: PropertyKey[],
	obj: T,
	visitorFunc: PropertyVisitorFunc,
	options: (Readonly<DeepWalkOptions> | undefined),
	rootObject: unknown,
): void => {
	if (!(isNotPrimitive(obj))) {
		return;
	}

	for (const key of getPropertyKeys(obj)) {
		const depth: boolean = (options?.depth === true);

		const newKeyPath: KeyPath = [...keyPath, key];

		const value: unknown = obj[key];

		const descriptor: PropertyDescriptor = getOwnPropertyDescriptor(obj, key);

		const visit = (): void => {
			visitorFunc(newKeyPath, value, obj, descriptor, rootObject);
		};

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
	deepWalkInternal([], obj, visitorFunc, options, obj);
}
deepFreeze(deepWalk);
