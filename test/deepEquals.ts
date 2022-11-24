/*
 * Copyright (c) 2020 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import deepEquals from "../src/deepEquals";
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
};

const bar = {
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
};

assert(deepEquals(foo, bar));

foo.a.x.yee = 64;

assert(!deepEquals(foo, bar));

assert(!deepEquals({
	0: "foo",
	1: "bar",
	2: "baz"
}, [
	"foo",
	"bar",
	"baz"
]));

assert(!deepEquals({
	0: "foo",
	1: "bar",
	2: "baz",
	length: 3
}, [
	"foo",
	"bar",
	"baz"
]));
