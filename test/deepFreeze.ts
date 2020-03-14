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
