/*
 * Copyright (c) 2022 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { deepFreeze } from "./deepFreeze";
import { GenericKey } from "./types";
import { canValueHaveProperties, getPropertyKeys, NonEmptyArray } from "./_internal/utils";

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

const deepWalkInternal = (
	keyPath: GenericKey[],
	obj: unknown,
	visitorFunc: PropertyVisitorFunc,
	options: (Readonly<DeepWalkOptions> | undefined),
	rootObject: unknown,
) => {
	if(!(canValueHaveProperties(obj))) {
		return;
	}

	for(const key of getPropertyKeys(obj)) {
		const depth: boolean = (options?.depth === true);

		const newKeyPath: KeyPath = [...keyPath, key];

		const value: unknown = (obj as Record<GenericKey, unknown>)[key];

		const descriptor: PropertyDescriptor = (Object.getOwnPropertyDescriptor(obj, key) as PropertyDescriptor);

		const visit = (() => visitorFunc(newKeyPath, value, obj, descriptor, rootObject));

		if(!depth) {
			visit();
		}

		deepWalkInternal(
			newKeyPath,
			value,
			visitorFunc,
			options,
			rootObject,
		);

		if(depth) {
			visit();
		}
	}
};

deepFreeze(deepWalkInternal);

/**
 * Recursively walks through **obj**.
 *
 * @param obj The object to walk through.
 * @param visitorFunc The visitor callback function to call on every property.
 * @param options Options object to change the behavior of `deepWalk`.
 */
function deepWalk(
	obj: unknown,
	visitorFunc: PropertyVisitorFunc,
	options?: Readonly<DeepWalkOptions>,
) {
	return deepWalkInternal([], obj, visitorFunc, options, obj);
}

deepFreeze(deepWalk);

export { deepWalk };
