<!--
  Copyright (c) 2023 Michael Federczuk
  SPDX-License-Identifier: CC-BY-SA-4.0
-->

# DeepTools #

[version_shield]: https://img.shields.io/badge/version-2.0.0-indev02-informational.svg
[release_page]: https://github.com/mfederczuk/deeptools/releases/tag/v2.0.0-indev02 "Release v2.0.0-indev02"
[![version: 2.0.0-indev02][version_shield]][release_page]
[![Changelog](https://img.shields.io/badge/-Changelog-informational.svg)](CHANGELOG.md "Changelog")

## About ##

**DeepTools** is a set of JavaScript utility functions that recursively operate on objects.

## Usage ##

### [`deepCopy`](src/deepCopy.ts) ###

```ts
function deepCopy<T>(obj: T): T;
```

Creates a deep copy of **obj**.

### [`deepEquals`](src/deepEquals.ts) ###

```ts
function deepEquals(obj1: unknown, obj2: unknown): boolean;
```

Checks if **obj1** and **obj2** are equal by recursing through their properties.

### [`deepFreeze`](src/deepFreeze.ts) ###

```ts
function deepFreeze<T>(arr: T[][]): readonly (readonly Readonly<T>[])[];
```

Recursively freezes **arr**, all of **arr**'s items and all items of **arr**'s items.

```ts
function deepFreeze<T>(arr: T[]): readonly Readonly<T>[];
```

Recursively freezes **arr** and all of its items.

```ts
function deepFreeze<T>(obj: T): Readonly<T>;
```

Recursively freezes **obj** and all of its properties.

### [`safeCopy`](src/safeCopy.ts) ###

```ts
function safeCopy<T>(arr: T[][]): readonly (readonly Readonly<T>[])[];
function safeCopy<T>(arr: T[]): readonly Readonly<T>[];
```

Creates a safe copy of **arr** by creating a deep frozen copy of it.

```ts
function safeCopy<T>(obj: T): Readonly<T>;
```

Creates a safe copy of **obj** by creating a deep frozen copy of it.

## Installation ##

Using **npm**:

```sh
npm i @mfederczuk/deeptools
```

Using **yarn**:

```sh
yarn add @mfederczuk/deeptools
```

## Contributing ##

Read through the [Contribution Guidelines](CONTRIBUTING.md) if you want to contribute to this project.

## License ##

**DeepTools** is licensed under the [**GNU General Public License v3.0 or later**](LICENSES/GPL-3.0.txt).  
For more information about copying and licensing, see the [`COPYING.txt`](COPYING.txt) file.
