# DeepTools #

[version_shield]: https://img.shields.io/badge/version-1.1.0-blue.svg
[latest_release]: https://github.com/mfederczuk/deeptools/releases/latest "Latest Release"
[![version: 1.1.0][version_shield]][latest_release]
[![Changelog](https://img.shields.io/badge/-Changelog-blue)](./CHANGELOG.md "Changelog")

## About ##

**DeepTools** is a set of utility functions that recursively operate on objects.

## Download ##

Using **npm**:

```sh
npm i @mfederczuk/deeptools
```

Using **Yarn**:

```sh
yarn add @mfederczuk/deeptools
```

## Usage ##

### [`deepCopy`](./src/deepCopy.ts) ###

```ts
function deepCopy<T>(obj: T): T;
```

Creates a deep copy of **obj**.

### [`deepEquals`](./src/deepEquals.ts) ###

```ts
function deepEquals(obj1: unknown, obj2: unknown): boolean;
```

Checks if **obj1** and **obj2** are equal by recursing through their properties.

### [`deepFreeze`](./src/deepFreeze.ts) ###

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

### [`safeCopy`](./src/safeCopy.ts) ###

```ts
function safeCopy<T>(arr: T[][]): readonly (readonly Readonly<T>[])[];
function safeCopy<T>(arr: T[]): readonly Readonly<T>[];
```

Creates a safe copy of **arr** by creating a deep frozen copy of it.

```ts
function safeCopy<T>(obj: T): Readonly<T>;
```

Creates a safe copy of **obj** by creating a deep frozen copy of it.

## Contributing ##

Read through the [DeepTools Contribution Guidelines](./CONTRIBUTING.md)
 if you want to contribute to this project.

## License ##

[GNU GPLv3+](./LICENSE)
