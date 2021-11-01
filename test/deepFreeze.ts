/*
 * A set of utility functions that recursively operate on objects.
 * Copyright (C) 2020  Michael Federczuk
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

/* eslint-disable no-empty */

import deepFreeze from "../src/deepFreeze";
import assert from "assert";

const foo = deepFreeze({
	a: {
		x: {
			yee: 16,
			haw: null
		},
		y: [
			"123",
			32,
			true
		],
		z: 64
	},
	b: [
		[
			{},
			[],
			0,
			"",
			false
		],
		{
			abc: 123,
			xyz: "asd"
		}
	]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

try {
	foo.a.x.yee = 128;
} catch(err) {}

try {
	foo.a.x.haw = undefined;
} catch(err) {}

try {
	foo.a.y[0] = "xyz";
} catch(err) {}

try {
	foo.a.y[1] = "256";
} catch(err) {}

try {
	foo.a.y[2] = false;
} catch(err) {}

try {
	foo.a.z = 512;
} catch(err) {}

try {
	foo.b[0][2] = true;
} catch(err) {}

try {
	foo.b[0][3] = "___";
} catch(err) {}

try {
	foo.b[0][4] = null;
} catch(err) {}

try {
	foo.b[1].abc = 789;
} catch(err) {}

try {
	foo.b[1].xyz = "dsa";
} catch(err) {}

assert(foo.a.x.yee  === 16);
assert(foo.a.x.haw  === null);
assert(foo.a.y[0]   === "123");
assert(foo.a.y[1]   === 32);
assert(foo.a.y[2]   === true);
assert(foo.a.z      === 64);
assert(foo.b[0][2]  === 0);
assert(foo.b[0][3]  === "");
assert(foo.b[0][4]  === false);
assert(foo.b[1].abc === 123);
assert(foo.b[1].xyz === "asd");
