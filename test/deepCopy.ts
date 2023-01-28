/*
 * Copyright (c) 2023 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import assert from "assert";
import { describe } from "mocha";
import { deepCopy } from "../src";

describe("function deepCopy()", function() {
	//#region values w/out properties

	it("should work with undefined", function() {
		assert.strictEqual(deepCopy(undefined), undefined);
	});

	it("should work with null", function() {
		assert.strictEqual(deepCopy(null), null);
	});

	it("should work with booleans", function() {
		assert.strictEqual(deepCopy(true), true);
		assert.strictEqual(deepCopy(false), false);
	});

	it("should work with numbers", function() {
		assert.strictEqual(deepCopy(64), 64);
		assert.strictEqual(deepCopy(123456789), 123456789);
		assert.strictEqual(deepCopy(-77), -77);
		assert.strictEqual(deepCopy(-80000), -80000);

		assert.strictEqual(deepCopy(1.5), 1.5);
		assert.strictEqual(deepCopy(420.69), 420.69);
		assert.strictEqual(deepCopy(-13.37), -13.37);
		assert.strictEqual(deepCopy(-654.56), -654.56);

		assert.strictEqual(deepCopy(Number.MAX_VALUE), Number.MAX_VALUE);
		assert.strictEqual(deepCopy(Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER);
		assert.strictEqual(deepCopy(Number.MIN_VALUE), Number.MIN_VALUE);
		assert.strictEqual(deepCopy(Number.MIN_SAFE_INTEGER), Number.MIN_SAFE_INTEGER);

		assert.strictEqual(deepCopy(Infinity), Infinity);
		assert.strictEqual(deepCopy(-Infinity), -Infinity);

		assert.strictEqual(deepCopy(NaN), NaN);
		assert.notStrictEqual(deepCopy(NaN), 0);
		assert.notStrictEqual(deepCopy(-1), NaN);
	});

	it("should work with strings", function() {
		assert.strictEqual(deepCopy("foobar"), "foobar");
		assert.strictEqual(deepCopy("yee haw, pardner'"), "yee haw, pardner'");
		assert.strictEqual(deepCopy(""), "");
		assert.strictEqual(deepCopy("úǹíćòdé"), "úǹíćòdé"); // cSpell:ignore úǹíćòdé
		assert.strictEqual(deepCopy("definitely a c-string\0undefined behavior yo"), "definitely a c-string\0undefined behavior yo");

		const veryLongString: string = ("a".repeat(1024) + "b".repeat(512) + "c".repeat(256));
		assert.strictEqual(deepCopy(veryLongString), veryLongString);
	});

	it("should work with bigints", function() {
		assert.strictEqual(deepCopy(BigInt("13579")), BigInt("13579"));
		assert.strictEqual(deepCopy(BigInt("99999999999999999999999999999999")), BigInt("99999999999999999999999999999999"));
		assert.strictEqual(deepCopy(BigInt("-864297531")), BigInt("-864297531"));
		assert.strictEqual(deepCopy(BigInt("-31866526658764854719684918615")), BigInt("-31866526658764854719684918615"));
	});

	it("should work with symbols (same symbol instance, not just same description)", function() {
		const fooSymInput = Symbol("foo");
		const fooSymCopy = deepCopy(fooSymInput);
		assert.strictEqual(fooSymCopy, fooSymInput);
		assert.strictEqual(fooSymCopy.description, fooSymInput.description);

		const emptySym1Input = Symbol();
		const emptySym2Copy = deepCopy(emptySym1Input);
		assert.strictEqual(emptySym2Copy, emptySym1Input);
		assert.strictEqual(emptySym2Copy.description, emptySym1Input.description);

		const barDesc = "bar";
		const barSym1 = Symbol(barDesc);
		const barSym2Copied = deepCopy(Symbol(barDesc));
		assert.notStrictEqual(barSym2Copied, barSym1);
		assert.strictEqual(barSym2Copied.description, barSym1.description);

		const emptySym3 = Symbol();
		const emptySym4Copied = deepCopy(Symbol());
		assert.notStrictEqual(emptySym4Copied, emptySym3);
		assert.strictEqual(emptySym4Copied.description, emptySym3.description);
	});

	//#endregion

	//#region values w/ properties

	const standardObjectAssert = (copy: object, input: object): (void | never) => {
		assert.deepStrictEqual(copy, input);
		assert.strictEqual(String(copy), String(input));
		assert.notStrictEqual(copy, input);
	};

	const isTypeError = (e: unknown): e is TypeError => {
		return (e instanceof TypeError);
	};


	it("should work with simple objects", function() {
		assert.notStrictEqual(deepCopy({}), {});


		const fooInput = {
			foo: 64,
			bar: "baz",
			yee: true,
			haw: undefined,
		};
		const fooCopy = deepCopy(fooInput);

		assert.strictEqual(fooCopy.foo, fooInput.foo);
		assert.strictEqual(fooCopy.bar, fooInput.bar);
		assert.strictEqual(fooCopy.yee, fooInput.yee);
		assert.strictEqual(fooCopy.haw, fooInput.haw);
		standardObjectAssert(fooCopy, fooInput);

		fooCopy.foo = 128;
		fooCopy.bar = "not baz";
		fooCopy.yee = false;

		assert.notStrictEqual(fooCopy.foo, fooInput.foo);
		assert.notStrictEqual(fooCopy.bar, fooInput.bar);
		assert.notStrictEqual(fooCopy.yee, fooInput.yee);
		assert.notDeepStrictEqual(fooCopy, fooInput);
		assert.strictEqual(String(fooCopy), String(fooInput));


		const barInput = {
			test: {
				"space in key": {
					"?": 0,
				},
				foobar: null,
			},
			arr: [
				"string1",
				true,
				"string2",
				{
					key1: "string3",
					key2: "string4",
				},
			],
			val: 99,
			obj: {
				anotherArr: [
					"i'm a pirate",
					BigInt("-99"),
				],
			},
		} as const;

		const barCopy = deepCopy(barInput);

		assert.strictEqual(barCopy.test["space in key"]["?"], barInput.test["space in key"]["?"]);
		assert.notStrictEqual(barCopy.test["space in key"], barInput.test["space in key"]);
		assert.strictEqual(barCopy.test.foobar, barInput.test.foobar);
		assert.notStrictEqual(barCopy.test, barInput.test);

		assert.strictEqual(barCopy.arr[0], barInput.arr[0]);
		assert.strictEqual(barCopy.arr[1], barInput.arr[1]);
		assert.strictEqual(barCopy.arr[2], barInput.arr[2]);
		assert.strictEqual(barCopy.arr[3].key1, barInput.arr[3].key1);
		assert.strictEqual(barCopy.arr[3].key2, barInput.arr[3].key2);
		assert.notStrictEqual(barCopy.arr[3], barInput.arr[3]);
		assert.notStrictEqual(barCopy.arr, barInput.arr);

		assert.strictEqual(barCopy.val, barInput.val);

		assert.strictEqual(barCopy.obj.anotherArr[0], barInput.obj.anotherArr[0]);
		assert.strictEqual(barCopy.obj.anotherArr[1], barInput.obj.anotherArr[1]);
		assert.notStrictEqual(barCopy.obj.anotherArr, barInput.obj.anotherArr);
		assert.notStrictEqual(barCopy.obj, barInput.obj);

		standardObjectAssert(barCopy, barInput);
	});

	it("should work with arrays", function() {
		const fooInput = [
			64,
			"foo bar",
			[
				[],
				BigInt("123456789"),
				undefined,
			],
			new Object(),
		] as const;

		const fooCopy = deepCopy(fooInput);

		assert.strictEqual(fooCopy[0], fooInput[0]);

		assert.strictEqual(fooCopy[1], fooInput[1]);

		assert.notStrictEqual(fooCopy[2][0], fooInput[2][0]);
		assert.strictEqual(fooCopy[2][1], fooInput[2][1]);
		assert.strictEqual(fooCopy[2][2], fooInput[2][2]);
		assert.notStrictEqual(fooCopy[2], fooInput[2]);

		assert.notStrictEqual(fooCopy[3], fooInput[3]);

		standardObjectAssert(fooCopy, fooInput);


		/* eslint-disable @typescript-eslint/no-explicit-any */

		const barInput = [
			true,
			{
				// cSpell:ignore boycow cowcow boyboy
				cowboy: "yee haw",
				boycow: "haw yee",
				cowcow: "yee yee",
				boyboy: "haw haw",
				"what's so funny?": "you wouldn't get it",
			},
			false,
		] as const;
		(barInput as any)["yee"] = 55;
		(barInput as any)["haw"] = [66];
		const barCopy = deepCopy(barInput);

		assert.strictEqual(barCopy[0], barInput[0]);

		assert.strictEqual(barCopy[1].cowboy, barInput[1].cowboy);
		assert.strictEqual(barCopy[1].boycow, barInput[1].boycow);
		assert.strictEqual(barCopy[1].cowcow, barInput[1].cowcow);
		assert.strictEqual(barCopy[1].boyboy, barInput[1].boyboy);
		assert.strictEqual(barCopy[1]["what's so funny?"], barInput[1]["what's so funny?"]);
		assert.notStrictEqual(barCopy[1], barInput[1]);

		assert.strictEqual(barCopy[2], barInput[2]);

		assert.strictEqual((barCopy as any)["yee"], 55);
		assert.strictEqual((barCopy as any)["haw"][0], 66);

		standardObjectAssert(barCopy, barInput);

		/* eslint-enable @typescript-eslint/no-explicit-any */
	});

	it("should work with classes", function() {
		class Foo {
			constructor(
				readonly a: number,
				readonly b: string,
			) {
				// eslint-disable-next-line no-empty-function
			}

			yeeHaw() {
				throw new Error("Don't invoke me, bro");
			}
		}

		const fooInput = new Foo(64, "bar");
		const fooCopy = deepCopy(fooInput);

		assert.strictEqual(fooCopy.a, fooInput.a);
		assert.strictEqual(fooCopy.b, fooInput.b);

		assert.strictEqual(Object.getPrototypeOf(fooCopy), Object.getPrototypeOf(fooInput));
		assert.strictEqual(fooCopy.yeeHaw, fooInput.yeeHaw);
		assert.strictEqual(fooCopy.constructor, fooInput.constructor);

		assert.strictEqual(Object.getPrototypeOf(fooCopy), Foo.prototype);
		assert.strictEqual(fooCopy.yeeHaw, Foo.prototype.yeeHaw);
		assert.strictEqual(fooCopy.constructor, Foo);

		standardObjectAssert(fooCopy, fooInput);


		class Bar extends Foo {
			constructor(
				a: number,
				b: string,
				readonly c: boolean,
			) {
				super(a, b);
			}
		}

		const barInput = new Bar(128, "baz", true);
		const barCopy = deepCopy(barInput);

		assert.strictEqual(barCopy.a, barInput.a);
		assert.strictEqual(barCopy.b, barInput.b);
		assert.strictEqual(barCopy.c, barInput.c);


		assert.strictEqual(Object.getPrototypeOf(barCopy), Object.getPrototypeOf(barInput));
		assert.strictEqual(barCopy.yeeHaw, barInput.yeeHaw);
		assert.strictEqual(barCopy.constructor, barInput.constructor);

		assert.strictEqual(Object.getPrototypeOf(barCopy), Bar.prototype);
		assert.strictEqual(barCopy.yeeHaw, Bar.prototype.yeeHaw);
		assert.strictEqual(barCopy.constructor, Bar);

		assert.strictEqual(Object.getPrototypeOf(Object.getPrototypeOf(barCopy)), Foo.prototype);
		assert.strictEqual(barCopy.yeeHaw, Foo.prototype.yeeHaw);

		standardObjectAssert(barCopy, barInput);
	});

	it("should work with objects with custom configured properties", function() {
		const objInput: Record<string, unknown> = {};
		const fooKey = "foo";
		const barKey = "bar";
		const bazKey = "baz";

		let barReturn = 64;

		Object.defineProperty(objInput, fooKey, { value: "test string", enumerable: false });
		Object.defineProperty(
			objInput,
			barKey,
			{
				get(): number {
					const ret = barReturn;
					++barReturn;
					return ret;
				},
			},
		);
		Object.defineProperty(objInput, bazKey, { value: "constant", writable: false });

		const objCopy = deepCopy(objInput);


		assert.strictEqual(objCopy[fooKey], objInput[fooKey]);
		assert.notStrictEqual(objCopy[barKey], objInput[barKey]);
		assert.notStrictEqual(objCopy[barKey], objCopy[barKey]);
		assert.strictEqual(objCopy[bazKey], objInput[bazKey]);

		standardObjectAssert(objCopy, objInput);

		for (const key in objCopy) {
			assert.notStrictEqual(key, fooKey);
		}

		assert.throws(
			() => {
				objCopy[bazKey] = "not constant";
			},
			isTypeError,
		);
	});

	it("should work with objects with getters", function() {
		const fooInput = {
			get x(): never {
				throw new Error("Don't invoke me, bro");
			},

			get y(): number {
				return 64;
			},
		} as const;

		const fooCopy = deepCopy(fooInput);

		assert.throws(() => {
			fooCopy.x;
		});
		assert.strictEqual(fooCopy.y, fooInput.y);
		assert.notStrictEqual(fooCopy, fooInput);
	});

	it("should work with objects with setters", function() {
		const fooInput = {
			set x(_: number) {
				throw new Error("Don't invoke me either, bro");
			},

			set y(_: number) {
				void _;
			},
		} as const;

		const fooCopy = deepCopy(fooInput);

		assert.throws(() => {
			fooCopy.x = 5;
		});
		fooCopy.y = 10;
		assert.notStrictEqual(fooCopy, fooInput);
	});

	it("should work with Date objects", function() {
		const fooInput = new Date(2147483647000);
		const fooCopy = deepCopy(fooInput);

		assert.strictEqual(fooCopy.getTime(), fooInput.getTime());
		standardObjectAssert(fooCopy, fooInput);


		/* eslint-disable @typescript-eslint/no-explicit-any */

		const barInput = new Date();
		(barInput as any)["Hello there"] = "General Kenobi";
		(barInput as any)["some key"] = { foo: "bar" };

		const barCopy = deepCopy(barInput);

		assert.strictEqual(barCopy.getTime(), barInput.getTime());

		assert.strictEqual((barCopy as any)["Hello there"], (barInput as any)["Hello there"]);

		assert.strictEqual((barCopy as any)["some key"].foo, (barInput as any)["some key"].foo);
		assert.notStrictEqual((barCopy as any)["some key"], (barInput as any)["some key"]);

		standardObjectAssert(barCopy, barInput);

		/* eslint-enable @typescript-eslint/no-explicit-any */
	});

	it("should work with RegExp objects", function() {
		const assertRegExp = (copy: RegExp, input: RegExp) => {
			assert.strictEqual(copy.source, input.source);

			assert.strictEqual(copy.flags, input.flags);

			assert.strictEqual(copy.dotAll, input.dotAll);
			assert.strictEqual(copy.global, input.global);
			assert.strictEqual(copy.ignoreCase, input.ignoreCase);
			assert.strictEqual(copy.multiline, input.multiline);
			assert.strictEqual(copy.sticky, input.sticky);
			assert.strictEqual(copy.unicode, input.unicode);

			assert.strictEqual(copy.lastIndex, input.lastIndex);


			standardObjectAssert(copy, input);
		};


		const fooInput = /(pee)+ (poo)+/;
		assertRegExp(deepCopy(fooInput), fooInput);


		const barInput = RegExp("");
		assertRegExp(deepCopy(barInput), barInput);
		assertRegExp(deepCopy(fooInput), fooInput);


		const bazInput = /foo/gi;
		assertRegExp(deepCopy(bazInput), bazInput);
		assertRegExp(deepCopy(fooInput), fooInput);


		/* eslint-disable @typescript-eslint/no-explicit-any */

		const key: string = "i don't know man i'm running out of random strings";

		const yeeInput = /foobar/;
		(yeeInput as any)["haw"] = { [key]: 7 };
		(yeeInput as any)["yeehaw"] = true;

		const yeeCopy = deepCopy(yeeInput);

		assert.strictEqual((yeeCopy as any)["haw"][key], (yeeInput as any)["haw"][key]);
		standardObjectAssert((yeeCopy as any)["haw"], (yeeInput as any)["haw"]);
		assert.strictEqual((yeeCopy as any)["yeehaw"], true);
		assertRegExp(yeeCopy, yeeInput);

		/* eslint-enable @typescript-eslint/no-explicit-any */
	});

	it("should work with Map objects"); // TODO

	it("should work with Set objects"); // TODO

	//#region scalar arrays

	it("should work with Int8Array objects", function() {
		const fooInput = new Int8Array([-128, -64, 0, 63, 127]);
		const fooCopy = deepCopy(fooInput);

		assert.strictEqual(fooCopy.length, fooInput.length);
		assert.strictEqual(fooCopy[0], fooInput[0]);
		assert.strictEqual(fooCopy[1], fooInput[1]);
		assert.strictEqual(fooCopy[2], fooInput[2]);
		assert.strictEqual(fooCopy[3], fooInput[3]);
		assert.strictEqual(fooCopy[4], fooInput[4]);
		standardObjectAssert(fooCopy, fooInput);


		const barInput = new Int8Array([]);
		const barCopy = deepCopy(barInput);

		assert.strictEqual(barCopy.length, barInput.length);
		standardObjectAssert(barCopy, barInput);


		/* eslint-disable @typescript-eslint/no-explicit-any */

		const bazInput = new Int8Array([32, 96]);
		(bazInput as any)["foo"] = 64;
		(bazInput as any)["bar"] = "poopoo peepee";

		const bazCopy = deepCopy(bazInput);

		assert.strictEqual(bazCopy.length, bazInput.length);
		assert.strictEqual((bazCopy as any)["foo"], (bazInput as any)["foo"]);
		assert.strictEqual((bazCopy as any)["bar"], (bazInput as any)["bar"]);
		standardObjectAssert(bazCopy, bazInput);

		/* eslint-enable @typescript-eslint/no-explicit-any */
	});
	it("should work with Uint8Array objects", function() {
		const fooInput = new Uint8Array([0, 63, 127, 255]);
		const fooCopy = deepCopy(fooInput);

		assert.strictEqual(fooCopy.length, fooInput.length);
		assert.strictEqual(fooCopy[0], fooInput[0]);
		assert.strictEqual(fooCopy[1], fooInput[1]);
		assert.strictEqual(fooCopy[2], fooInput[2]);
		assert.strictEqual(fooCopy[3], fooInput[3]);
		assert.strictEqual(fooCopy[4], fooInput[4]);
		standardObjectAssert(fooCopy, fooInput);


		const barInput = new Uint8Array([]);
		const barCopy = deepCopy(barInput);

		assert.strictEqual(barCopy.length, barInput.length);
		standardObjectAssert(barCopy, barInput);


		/* eslint-disable @typescript-eslint/no-explicit-any */

		const bazInput = new Uint8Array([32, 96]);
		(bazInput as any)["foo"] = 64;
		(bazInput as any)["bar"] = "poopoo peepee";

		const bazCopy = deepCopy(bazInput);

		assert.strictEqual(bazCopy.length, bazInput.length);
		assert.strictEqual((bazCopy as any)["foo"], (bazInput as any)["foo"]);
		assert.strictEqual((bazCopy as any)["bar"], (bazInput as any)["bar"]);
		standardObjectAssert(bazCopy, bazInput);

		/* eslint-enable @typescript-eslint/no-explicit-any */
	});
	it("should work with Uint8ClampedArray objects", function() {
		const fooInput = new Uint8Array([0, 63, 127, 255]);
		const fooCopy = deepCopy(fooInput);

		assert.strictEqual(fooCopy.length, fooInput.length);
		assert.strictEqual(fooCopy[0], fooInput[0]);
		assert.strictEqual(fooCopy[1], fooInput[1]);
		assert.strictEqual(fooCopy[2], fooInput[2]);
		assert.strictEqual(fooCopy[3], fooInput[3]);
		assert.strictEqual(fooCopy[4], fooInput[4]);
		standardObjectAssert(fooCopy, fooInput);


		const barInput = new Uint8Array([]);
		const barCopy = deepCopy(barInput);

		assert.strictEqual(barCopy.length, barInput.length);
		standardObjectAssert(barCopy, barInput);


		/* eslint-disable @typescript-eslint/no-explicit-any */

		const bazInput = new Uint8Array([32, 96]);
		(bazInput as any)["foo"] = 64;
		(bazInput as any)["bar"] = "poopoo peepee";

		const bazCopy = deepCopy(bazInput);

		assert.strictEqual(bazCopy.length, bazInput.length);
		assert.strictEqual((bazCopy as any)["foo"], (bazInput as any)["foo"]);
		assert.strictEqual((bazCopy as any)["bar"], (bazInput as any)["bar"]);
		standardObjectAssert(bazCopy, bazInput);

		/* eslint-enable @typescript-eslint/no-explicit-any */
	});

	it("should work with Int16Array objects", function() {
		const fooInput = new Int16Array([-0x8000, -0x4000, 0, 0x3FFF, 0x7FFF]);
		const fooCopy = deepCopy(fooInput);

		assert.strictEqual(fooCopy.length, fooInput.length);
		assert.strictEqual(fooCopy[0], fooInput[0]);
		assert.strictEqual(fooCopy[1], fooInput[1]);
		assert.strictEqual(fooCopy[2], fooInput[2]);
		assert.strictEqual(fooCopy[3], fooInput[3]);
		assert.strictEqual(fooCopy[4], fooInput[4]);
		standardObjectAssert(fooCopy, fooInput);


		const barInput = new Int16Array([]);
		const barCopy = deepCopy(barInput);

		assert.strictEqual(barCopy.length, barInput.length);
		standardObjectAssert(barCopy, barInput);


		/* eslint-disable @typescript-eslint/no-explicit-any */

		const bazInput = new Int16Array([32, 96]);
		(bazInput as any)["foo"] = 64;
		(bazInput as any)["bar"] = "poopoo peepee";

		const bazCopy = deepCopy(bazInput);

		assert.strictEqual(bazCopy.length, bazInput.length);
		assert.strictEqual((bazCopy as any)["foo"], (bazInput as any)["foo"]);
		assert.strictEqual((bazCopy as any)["bar"], (bazInput as any)["bar"]);
		standardObjectAssert(bazCopy, bazInput);

		/* eslint-enable @typescript-eslint/no-explicit-any */
	});
	it("should work with Uint16Array objects", function() {
		const fooInput = new Uint16Array([0, 0x3FFF, 0x7FFF, 0xFFFF]);
		const fooCopy = deepCopy(fooInput);

		assert.strictEqual(fooCopy.length, fooInput.length);
		assert.strictEqual(fooCopy[0], fooInput[0]);
		assert.strictEqual(fooCopy[1], fooInput[1]);
		assert.strictEqual(fooCopy[2], fooInput[2]);
		assert.strictEqual(fooCopy[3], fooInput[3]);
		assert.strictEqual(fooCopy[4], fooInput[4]);
		standardObjectAssert(fooCopy, fooInput);


		const barInput = new Uint16Array([]);
		const barCopy = deepCopy(barInput);

		assert.strictEqual(barCopy.length, barInput.length);
		standardObjectAssert(barCopy, barInput);


		/* eslint-disable @typescript-eslint/no-explicit-any */

		const bazInput = new Uint16Array([32, 96]);
		(bazInput as any)["foo"] = 64;
		(bazInput as any)["bar"] = "poopoo peepee";

		const bazCopy = deepCopy(bazInput);

		assert.strictEqual(bazCopy.length, bazInput.length);
		assert.strictEqual((bazCopy as any)["foo"], (bazInput as any)["foo"]);
		assert.strictEqual((bazCopy as any)["bar"], (bazInput as any)["bar"]);
		standardObjectAssert(bazCopy, bazInput);

		/* eslint-enable @typescript-eslint/no-explicit-any */
	});

	it("should work with Int32Array objects", function() {
		const fooInput = new Int32Array([-0x80000000, -0x40000000, 0, 0x3FFFFFFF, 0x7FFFFFFF]);
		const fooCopy = deepCopy(fooInput);

		assert.strictEqual(fooCopy.length, fooInput.length);
		assert.strictEqual(fooCopy[0], fooInput[0]);
		assert.strictEqual(fooCopy[1], fooInput[1]);
		assert.strictEqual(fooCopy[2], fooInput[2]);
		assert.strictEqual(fooCopy[3], fooInput[3]);
		assert.strictEqual(fooCopy[4], fooInput[4]);
		standardObjectAssert(fooCopy, fooInput);


		const barInput = new Int32Array([]);
		const barCopy = deepCopy(barInput);

		assert.strictEqual(barCopy.length, barInput.length);
		standardObjectAssert(barCopy, barInput);


		/* eslint-disable @typescript-eslint/no-explicit-any */

		const bazInput = new Int32Array([32, 96]);
		(bazInput as any)["foo"] = 64;
		(bazInput as any)["bar"] = "poopoo peepee";

		const bazCopy = deepCopy(bazInput);

		assert.strictEqual(bazCopy.length, bazInput.length);
		assert.strictEqual((bazCopy as any)["foo"], (bazInput as any)["foo"]);
		assert.strictEqual((bazCopy as any)["bar"], (bazInput as any)["bar"]);
		standardObjectAssert(bazCopy, bazInput);

		/* eslint-enable @typescript-eslint/no-explicit-any */
	});
	it("should work with Uint32Array objects", function() {
		const fooInput = new Uint32Array([0, 0x3FFFFFFF, 0x7FFFFFFF, 0xFFFFFFFF]);
		const fooCopy = deepCopy(fooInput);

		assert.strictEqual(fooCopy.length, fooInput.length);
		assert.strictEqual(fooCopy[0], fooInput[0]);
		assert.strictEqual(fooCopy[1], fooInput[1]);
		assert.strictEqual(fooCopy[2], fooInput[2]);
		assert.strictEqual(fooCopy[3], fooInput[3]);
		assert.strictEqual(fooCopy[4], fooInput[4]);
		standardObjectAssert(fooCopy, fooInput);


		const barInput = new Uint32Array([]);
		const barCopy = deepCopy(barInput);

		assert.strictEqual(barCopy.length, barInput.length);
		standardObjectAssert(barCopy, barInput);


		/* eslint-disable @typescript-eslint/no-explicit-any */

		const bazInput = new Uint32Array([32, 96]);
		(bazInput as any)["foo"] = 64;
		(bazInput as any)["bar"] = "poopoo peepee";

		const bazCopy = deepCopy(bazInput);

		assert.strictEqual(bazCopy.length, bazInput.length);
		assert.strictEqual((bazCopy as any)["foo"], (bazInput as any)["foo"]);
		assert.strictEqual((bazCopy as any)["bar"], (bazInput as any)["bar"]);
		standardObjectAssert(bazCopy, bazInput);

		/* eslint-enable @typescript-eslint/no-explicit-any */
	});

	it("should work with Float32Array objects"); // TODO
	it("should work with Float64Array objects"); // TODO

	it("should work with BigInt64Array objects"); // TODO
	it("should work with BigUint64Array objects"); // TODO

	//#endregion

	it("should work with ArrayBuffer objects"); // TODO

	//#endregion

	//#region invalid objects

	it("should throw TypeError when trying to copy WeakMap objects", function() {
		assert.throws(
			() => {
				const entries = [
					[new Object(), "foo"],
					[new Object(), 64],
				] as const;

				deepCopy(new WeakMap<object, unknown>(entries));
			},
			isTypeError,
		);

		assert.throws(
			() => {
				const obj = {
					foo: new WeakMap(),
				};

				deepCopy(obj);
			},
			isTypeError,
		);

		assert.throws(
			() => {
				const values = [
					"bar",
					new WeakMap(),
					"baz",
				];

				deepCopy(new Set(values));
			},
			isTypeError,
		);
	});

	it("should throw TypeError when trying to copy WeakSet objects", function() {
		assert.throws(
			() => {
				const values = [
					new Object(),
					new Object(),
				];

				deepCopy(new WeakSet(values));
			},
			isTypeError,
		);

		assert.throws(
			() => {
				const arr = [
					new WeakSet(),
				];

				deepCopy(arr);
			},
			isTypeError,
		);

		assert.throws(
			() => {
				const entries = [
					["foo", 64],
					[77, new WeakSet()],
				] as const;

				deepCopy(new Map<unknown, unknown>(entries));
			},
			isTypeError,
		);
	});

	it("should throw TypeError when trying to copy SharedArrayBuffer objects", function() {
		assert.throws(
			() => {
				deepCopy(new SharedArrayBuffer(64));
			},
			isTypeError,
		);

		assert.throws(
			() => {
				const arr = [
					new SharedArrayBuffer(128),
				];

				deepCopy(arr);
			},
			isTypeError,
		);
	});

	it("should throw TypeError when trying to copy DataView objects", function() {
		assert.throws(
			() => {
				deepCopy(new DataView(new ArrayBuffer(64)));
			},
			isTypeError,
		);

		assert.throws(
			() => {
				const arr = [
					new DataView(new ArrayBuffer(128)),
				];

				deepCopy(arr);
			},
			isTypeError,
		);
	});

	it("should throw TypeError when trying to copy Promise objects", function() {
		assert.throws(
			() => {
				const promise = new Promise((resolve) => { resolve(undefined); });
				deepCopy(promise);
			},
			isTypeError,
		);

		assert.throws(
			() => {
				const promise = new Promise((_resolve, reject) => { reject(); });
				deepCopy(promise);
			},
			isTypeError,
		);

		assert.throws(
			() => {
				deepCopy(Promise.resolve());
			},
			isTypeError,
		);

		assert.throws(
			() => {
				deepCopy(Promise.reject());
			},
			isTypeError,
		);

		assert.throws(
			() => {
				// eslint-disable-next-line no-empty-function
				deepCopy(new Promise(() => {}));
			},
			isTypeError,
		);
	});

	//#endregion
});
