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
