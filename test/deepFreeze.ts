/*
 * Copyright (c) 2023 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import assert from "assert";
import { describe } from "mocha";
import { deepFreeze } from "../src";

describe("function deepFreeze()", function() {
	//#region values w/out properties

	it("should be a noop with undefined", function() {
		assert.strictEqual(deepFreeze(undefined), undefined);
	});

	it("should be a noop with null", function() {
		assert.strictEqual(deepFreeze(null), null);
	});

	it("should be a noop with booleans", function() {
		assert.strictEqual(deepFreeze(true), true);
		assert.strictEqual(deepFreeze(false), false);
	});

	it("should be a noop with numbers", function() {
		assert.strictEqual(deepFreeze(654), 654);
		assert.strictEqual(deepFreeze(-88), -88);

		assert.strictEqual(deepFreeze(456.123), 456.123);
		assert.strictEqual(deepFreeze(-82.46), -82.46);

		assert.strictEqual(deepFreeze(Number.MAX_VALUE), Number.MAX_VALUE);
		assert.strictEqual(deepFreeze(Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER);
		assert.strictEqual(deepFreeze(Number.MIN_VALUE), Number.MIN_VALUE);
		assert.strictEqual(deepFreeze(Number.MIN_SAFE_INTEGER), Number.MIN_SAFE_INTEGER);

		assert.strictEqual(deepFreeze(Infinity), Infinity);
		assert.strictEqual(deepFreeze(-Infinity), -Infinity);

		assert.strictEqual(deepFreeze(NaN), NaN);
	});

	it("should be a noop with strings", function() {
		assert.strictEqual(deepFreeze("1 2 3"), "1 2 3");
		assert.strictEqual(deepFreeze(""), "");
	});

	it("should be a noop with bigints", function() {
		assert.strictEqual(deepFreeze(BigInt("159753456258552162")), BigInt("159753456258552162"));
		assert.strictEqual(deepFreeze(BigInt("-123456789987654321")), BigInt("-123456789987654321"));
	});

	it("should work with symbols", function() {
		const abcSymbol = Symbol("abc");
		assert.strictEqual(deepFreeze(abcSymbol), abcSymbol);

		const emptySymbol = Symbol();
		assert.strictEqual(deepFreeze(emptySymbol), emptySymbol);
	});

	//#endregion

	//#region values w/ properties

	const isTypeError = (e: unknown): e is TypeError => {
		return (e instanceof TypeError);
	};


	it("should work with simple objects", function() {
		const obj = {
			a: {
				x: {
					"a x": undefined,
				},
				y: null,
				z: 123,
			},
			b: [
				"*snore* mimimimi",
				[
					BigInt("123456789"),
				],
				false,
			],
			c: 55,
		};


		assert.strictEqual(deepFreeze(obj), obj);


		assert.throws(
			() => {
				obj.a = {
					x: {
						"a x": undefined,
					},
					y: null,
					z: 987,
				};
			},
			isTypeError,
		);

		assert.throws(
			() => {
				obj.a.x = {
					"a x": undefined,
				};
			},
			isTypeError,
		);

		assert.throws(
			() => {
				obj.a.x["a x"] = undefined;
			},
			isTypeError,
		);

		assert.throws(
			() => {
				obj.a.y = null;
			},
			isTypeError,
		);

		assert.throws(
			() => {
				obj.a.z = 456;
			},
			isTypeError,
		);


		assert.throws(
			() => {
				obj.b = [
					true,
					"nope",
					[
						BigInt("987654321"),
					],
				];
			},
			isTypeError,
		);

		assert.throws(
			() => {
				obj.b[0] = "something else";
			},
			isTypeError,
		);

		assert.throws(
			() => {
				obj.b[1] = true;
			},
			isTypeError,
		);

		assert.throws(
			() => {
				obj.b[2] = [
					BigInt("321654987"),
				];
			},
			isTypeError,
		);


		assert.throws(
			() => {
				obj.c = 5;
			},
			isTypeError,
		);


		assert.strictEqual(obj.a.x["a x"], undefined);
		assert.deepStrictEqual(obj.a.x, { "a x": undefined });
		assert.strictEqual(obj.a.y, null);
		assert.strictEqual(obj.a.z, 123);
		assert.deepStrictEqual(
			obj.a,
			{
				x: {
					"a x": undefined,
				},
				y: null,
				z: 123,
			},
		);

		assert.strictEqual(obj.b[0], "*snore* mimimimi");
		assert.strictEqual((obj.b[1] as bigint[])[0], BigInt("123456789"));
		assert.deepStrictEqual(obj.b[1], [BigInt("123456789")]);
		assert.strictEqual(obj.b[2], false);
		assert.deepStrictEqual(
			obj.b,
			[
				"*snore* mimimimi",
				[
					BigInt("123456789"),
				],
				false,
			],
		);

		assert.strictEqual(obj.c, 55);
	});

	it("should work with arrays"); // TODO

	it("should work with classes"); // TODO

	it("should work objects with custom configured properties"); // TODO

	it("should work with object getters", function() {
		const yVal: number = 64;

		const obj = {
			get x(): never {
				throw new Error("Don't invoke me, bro");
			},

			get y(): number {
				return yVal;
			},
		};

		assert.doesNotThrow(() => {
			deepFreeze(obj);
		});
	});

	it("should work with object setters", function() {
		const obj = {
			set x(_: unknown) {
				throw new Error("Don't invoke me either, bro");
			},

			set y(_: unknown) {
				void _;
			}
		};

		assert.doesNotThrow(() => {
			deepFreeze(obj);
		});
	});

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
});
