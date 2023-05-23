/*
 * SPDX-License-Identifier: CC0-1.0
 */

export class NullWeakSet<T extends object> implements WeakSet<T> {

	[Symbol.toStringTag]: string = "NullWeakSet";

	add(): this {
		return this;
	}

	delete(): false {
		return false;
	}

	has(): false {
		return false;
	}
}
