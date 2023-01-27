/*
 * Copyright (c) 2022 Michael Federczuk
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/* eslint-disable no-empty */

import assert from "assert";
import { describe } from "mocha";
import { deepFreeze } from "../src/deepFreeze";

describe("function deepFreeze()", function() {
	it("should work", function() {
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
		} catch (err) {}

		try {
			foo.a.x.haw = undefined;
		} catch (err) {}

		try {
			foo.a.y[0] = "xyz";
		} catch (err) {}

		try {
			foo.a.y[1] = "256";
		} catch (err) {}

		try {
			foo.a.y[2] = false;
		} catch (err) {}

		try {
			foo.a.z = 512;
		} catch (err) {}

		try {
			foo.b[0][2] = true;
		} catch (err) {}

		try {
			foo.b[0][3] = "___";
		} catch (err) {}

		try {
			foo.b[0][4] = null;
		} catch (err) {}

		try {
			foo.b[1].abc = 789;
		} catch (err) {}

		try {
			foo.b[1].xyz = "dsa";
		} catch (err) {}

		assert.strictEqual(foo.a.x.yee,  16);
		assert.strictEqual(foo.a.x.haw,  null);
		assert.strictEqual(foo.a.y[0],   "123");
		assert.strictEqual(foo.a.y[1],   32);
		assert.strictEqual(foo.a.y[2],   true);
		assert.strictEqual(foo.a.z,      64);
		assert.strictEqual(foo.b[0][2],  0);
		assert.strictEqual(foo.b[0][3],  "");
		assert.strictEqual(foo.b[0][4],  false);
		assert.strictEqual(foo.b[1].abc, 123);
		assert.strictEqual(foo.b[1].xyz, "asd");
	});
});
