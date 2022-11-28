/*
 * Copyright (c) 2022 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { deepCopy } from "../src/deepCopy";
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
