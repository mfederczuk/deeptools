/* jshint esversion: 6 */

/**
 * Creates a deep copy of **obj**.
 *
 * @param obj
 *        The object to create a deep copy of.
 *
 * @returns A deep copy of **obj**.
 */
export default function deepCopy(obj) {
	"use strict";

	if(typeof(obj) === "undefined" ||
	   obj === null ||
	   typeof(obj) === "boolean" ||
	   typeof(obj) === "number" ||
	   typeof(obj) === "string" ||
	   typeof(obj) === "symbol" ||
	   typeof(obj) === "function") return obj;

	if(obj instanceof Array) {
		const copy = [];

		const s = obj.length;
		for(let i = 0; i < s; ++i) {
			copy[i] = deepCopy(obj[i]);
		}

		return copy;
	}

	const copy = {};

	for(const prop of Object.getOwnPropertyNames(obj)) {
		copy[prop] = deepCopy(obj[prop]);
	}

	Object.setPrototypeOf(copy, Object.getPrototypeOf(obj));

	return copy;
}
