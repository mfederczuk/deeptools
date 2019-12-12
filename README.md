# DeepTools #

[version_shield]: https://img.shields.io/badge/version-N%2FA-blue.svg
[latest_release]: https://github.com/mfederczuk/deep-tools/releases/latest "Latest Release"
[![version: N/A][version_shield]][latest_release]
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

### [`deepCopy`](./src/deepCopy.js) ###

```ts
function deepCopy<T>(obj: T): T;
```

Creates a deep copy of **obj**.

### [`deepEquals`](./src/deepEquals.js) ###

```ts
function deepEquals(obj1: any, obj2: any): boolean;
```

Checks if **obj1** and **obj2** are equal by recursing through their properties.

### [`deepFreeze`](./src/deepFreeze.js) ###

```ts
function deepFreeze<T>(arr: T[]): ReadonlyArray<T>;
function deepFreeze<T extends Function>(fun: T): T;
function deepFreeze<T>(obj: T): Readonly<T>;
```

Recursively freezes **obj** with all of its properties.

### [`safeCopy`](./src/safeCopy.js) ###

```ts
function safeCopy<T>(obj: T): T;
```

Creates a safe copy of **obj** by creating a deep frozen copy of it.

## Contributing ##

Read through the [DeepTools Contribution Guidelines](./CONTRIBUTING.md)
 if you want to contribute to this project.

## License ##

[GNU GPLv3+](./LICENSE)
