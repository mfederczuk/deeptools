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

import deepCopy from "../src/deepCopy";
import assert from "assert";

const foo = {
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
} as any;

const bar = deepCopy(foo);

assert(foo.a.x.yee  === bar.a.x.yee);
assert(foo.a.x.haw  === bar.a.x.haw);
assert(foo.a.y[0]   === bar.a.y[0]);
assert(foo.a.y[1]   === bar.a.y[1]);
assert(foo.a.y[2]   === bar.a.y[2]);
assert(foo.a.z      === bar.a.z);
assert(foo.b[0][2]  === bar.b[0][2]);
assert(foo.b[0][3]  === bar.b[0][3]);
assert(foo.b[0][4]  === bar.b[0][4]);
assert(foo.b[1].abc === bar.b[1].abc);
assert(foo.b[1].xyz === bar.b[1].xyz);

bar.a.x.yee = 128;
bar.a.x.haw = undefined;
bar.a.y[0] = "xyz";
bar.a.y[1] = "256";
bar.a.y[2] = false;
bar.a.z = 512;
bar.b[0][2] = true;
bar.b[0][3] = "___";
bar.b[0][4] = null;
bar.b[1].abc = 789;
bar.b[1].xyz = "dsa";

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

assert(foo.a.x.yee  !== bar.a.x.yee);
assert(foo.a.x.haw  !== bar.a.x.haw);
assert(foo.a.y[0]   !== bar.a.y[0]);
assert(foo.a.y[1]   !== bar.a.y[1]);
assert(foo.a.y[2]   !== bar.a.y[2]);
assert(foo.a.z      !== bar.a.z);
assert(foo.b[0][2]  !== bar.b[0][2]);
assert(foo.b[0][3]  !== bar.b[0][3]);
assert(foo.b[0][4]  !== bar.b[0][4]);
assert(foo.b[1].abc !== bar.b[1].abc);
assert(foo.b[1].xyz !== bar.b[1].xyz);
