/*
 * Copyright (c) 2022 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import assert from "assert";
import { describe } from "mocha";
import { deepEquals } from "../src/deepEquals";

describe("function deepEquals()", function() {
	it("should work with NaN values", function() {
		assert(deepEquals(NaN, NaN));
		assert(!(deepEquals(NaN, 0)));
		assert(!(deepEquals(-1, NaN)));
	});

	it("should work", function() {
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
	});
});
