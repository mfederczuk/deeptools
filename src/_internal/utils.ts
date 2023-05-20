/*
 * Copyright (c) 2023 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { GenericKey } from "../types";

export type NonEmptyArray<T> = ([T, ...T[]] | [...T[], T]);

// eslint-disable-next-line @typescript-eslint/ban-types
export function isNonPrimitive(value: unknown): value is NonNullable<object | Function> {
	return (((typeof value === "object") && (value !== null)) ||
	        (typeof value === "function"));
}

export function getPropertyKeys(obj: NonNullable<unknown>): GenericKey[] {
	return [
		...(Object.getOwnPropertyNames(obj)),
		...(Object.getOwnPropertySymbols(obj)),
	];
}
