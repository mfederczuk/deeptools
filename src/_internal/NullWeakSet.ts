/*
 * SPDX-License-Identifier: CC0-1.0
 */

export class NullWeakSet<T extends WeakKey> implements WeakSet<T> {

	public [Symbol.toStringTag]: string = "NullWeakSet";

	public add(): this {
		return this;
	}

	public delete(): false {
		return false;
	}

	public has(): false {
		return false;
	}
}
