/*
 * Copyright (c) 2023 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import assert from "assert";
import { describe } from "mocha";
import { deepEquals } from "../src";

describe("function deepEquals()", function() {
	//#region value w/out properties

	it("should work with undefined", function() {
		assert(deepEquals(undefined, undefined));
	});

	it("should work with null", function() {
		assert(deepEquals(null, null));
	});

	it("should work with booleans", function() {
		assert(deepEquals(true, true));
		assert(deepEquals(false, false));
		assert(!(deepEquals(true, false)));
		assert(!(deepEquals(false, true)));
	});

	it("should work with numbers", function() {
		assert(deepEquals(952985, 952985));
		assert(deepEquals(-8888888888, -8888888888));
		assert(!(deepEquals(258, 852)));
		assert(!(deepEquals(14563, -14563)));
		assert(!(deepEquals(-1559, 1337)));

		assert(deepEquals(852.744447, 852.744447));
		assert(deepEquals(-987.4568, -987.4568));
		assert(!(deepEquals(777.4458, 777.0)));
		assert(!(deepEquals(0.2, -0.1)));
		assert(!(deepEquals(-741.74, 987.987987)));

		assert(deepEquals(Number.MAX_VALUE, Number.MAX_VALUE));
		assert(deepEquals(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER));
		assert(deepEquals(Number.MIN_VALUE, Number.MIN_VALUE));
		assert(deepEquals(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER));

		assert(deepEquals(Infinity, Infinity));
		assert(deepEquals(-Infinity, -Infinity));
		assert(!(deepEquals(Infinity, -Infinity)));
		assert(!(deepEquals(-Infinity, Infinity)));

		assert(deepEquals(NaN, NaN));
		assert(!(deepEquals(NaN, 0)));
		assert(!(deepEquals(-1, NaN)));
	});

	it("should work with strings", function() {
		assert(deepEquals("foobar", "foobar"));
		assert(deepEquals("", ""));
		assert(!(deepEquals("yee-fucking-haw", "yee haw")));
		assert(!(deepEquals("abc", "")));
		assert(!(deepEquals("", "xyz")));
	});

	it("should work with bigints", function() {
		assert(deepEquals(BigInt("1489876542587139"), BigInt("1489876542587139")));
		assert(deepEquals(BigInt("-1"), BigInt("-1")));
		assert(!(deepEquals(BigInt("12321147"), BigInt("123421147"))));
		assert(!(deepEquals(BigInt("-854654848"), BigInt("-1425"))));
		assert(!(deepEquals(BigInt("123456789"), BigInt("-123456789"))));
		assert(!(deepEquals(BigInt("-125"), BigInt("1144225896"))));
	});

	it("should work with symbols", function() {
		const fooSymDesc = "foo";
		const fooSym = Symbol(fooSymDesc);
		assert(deepEquals(fooSym, fooSym));
		assert(!(deepEquals(fooSym, Symbol(fooSymDesc))));

		const emptySym = Symbol();
		assert(deepEquals(emptySym, emptySym));
		assert(!(deepEquals(emptySym, Symbol(""))));

		assert(!(deepEquals(emptySym, fooSym)));
	});

	//#endregion

	//#region values w/ properties

	it("should work with simple objects");

	it("should work with arrays"); // TODO

	it("should work with classes"); // TODO

	it("should work objects with custom configured properties"); // TODO

	it("should work with object getters"); // TODO

	it("should work with object setters"); // TODO

	it("should work with Date objects"); // TODO

	it("should work RegExp objects"); // TODO

	it("should work Map objects"); // TODO

	it("should work Set objects"); // TODO

	//#region scalar arrays

	it("should work with Int8Array objects"); // TODO
	it("should work with Uint8Array objects"); // TODO
	it("should work with Uint8ClampedArray objects"); // TODO

	it("should work with Int16Array objects"); // TODO
	it("should work with Uint16Array objects"); // TODO

	it("should work with Int32Array objects"); // TODO
	it("should work with Uint32Array objects"); // TODO

	it("should work with Float32Array objects"); // TODO
	it("should work with Float64Array objects"); // TODO

	it("should work with BigInt64Array objects"); // TODO
	it("should work with BigUint64Array objects"); // TODO

	//#endregion

	it("should work with ArrayBuffer objects"); // TODO

	it("should work with WeakMap objects"); // TODO

	it("should work with WeakSet objects"); // TODO

	it("should work with SharedArrayBuffer objects"); // TODO

	it("should work with DataView objects"); // TODO

	it("should work with Promise objects"); // TODO

	//#endregion

	// TODO: remove
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
