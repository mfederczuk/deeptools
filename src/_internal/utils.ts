/*
 * Copyright (c) 2023 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { GenericKey } from "../types";

export type NonEmptyArray<T> = ([T, ...T[]] | [...T[], T]);

// eslint-disable-next-line @typescript-eslint/ban-types
export type NonPrimitive = NonNullable<object | Function>;

export function isNonPrimitive(value: unknown): value is NonPrimitive {
	return (((typeof value === "object") && (value !== null)) ||
	        (typeof value === "function"));
}

export function getPropertyKeys(obj: NonPrimitive): GenericKey[];
export function getPropertyKeys<T extends NonPrimitive>(obj: T): (keyof T)[];
export function getPropertyKeys<T extends NonPrimitive>(obj: T): (keyof T)[] {
	return [
		...(Object.getOwnPropertyNames(obj) as (keyof T)[]),
		...(Object.getOwnPropertySymbols(obj) as (keyof T)[]),
	];
}
