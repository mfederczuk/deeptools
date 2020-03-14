/*
 * A set of utility functions that recursively operate on objects.
 * Copyright (C) 2020 Michael Federczuk
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

export declare function deepCopy<T>(obj: T): T;

export declare function deepEquals(obj1: any, obj2: any): boolean;

export declare function deepFreeze<T>(arr: T[]): ReadonlyArray<T>;
export declare function deepFreeze<T extends Function>(fun: T): T;
export declare function deepFreeze<T>(obj: T): Readonly<T>;

export declare function safeCopy<T>(obj: T): T;
