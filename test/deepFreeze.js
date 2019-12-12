/* jshint esversion: 6 */

const { deepFreeze } = require("../src");
const assert = require("assert");

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
});

foo.a.x.yee = 128;
foo.a.x.haw = undefined;
foo.a.y[0] = "xyz";
foo.a.y[1] = "256";
foo.a.y[2] = false;
foo.a.z = 512;
foo.b[0][2] = true;
foo.b[0][3] = "___";
foo.b[0][4] = null;
foo.b[1].abc = 789;
foo.b[1].xyz = "dsa";

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
