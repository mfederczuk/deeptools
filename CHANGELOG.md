<!--
  Copyright (c) 2022 Michael Federczuk
  SPDX-License-Identifier: CC-BY-SA-4.0
-->

<!-- markdownlint-disable no-duplicate-heading -->

# Changelog #

All notable changes to this project will be documented in this file.
The format is based on [**Keep a Changelog v1.0.0**](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [**Semantic Versioning v2.0.0**](https://semver.org/spec/v2.0.0.html).

## Unreleased ##

### Added ###

* New `deepWalk` function
* Documentation comments are emitted into the type declaration files
* `deepCopy` & `deepFreeze` function declaration overload for 3-dimensional arrays

### Changed ###

* `deepCopy`, `deepFreeze` & `safeCopy` operate on function objects and also freeze and/or copy properties with
  symbol keys
* `deepCopy` & `safeCopy` also copy property configurations
* `deepCopy` & `safeCopy` properly copy the following object types:
  * `RegExp`
  * `Date`
  * `Map`
  * `Set`
  * `Int8Array`
  * `Uint8Array`
  * `Uint8ClampedArray`
  * `Int16Array`
  * `Uint16Array`
  * `Int32Array`
  * `Uint32Array`
  * `Float32Array`
  * `Float64Array`
  * `BigInt64Array`
  * `BigUint64Array`
  * `ArrayBuffer`
* `deepCopy` & `safeCopy` throw a `TypeError` when attempting to copy any of the following types:
  * function
  * `WeakMap`
  * `WeakSet`
  * `SharedArrayBuffer`
  * `DataView`
  * `Promise`

### Security ###

* Updated dependencies

## [v1.1.1] - 2022-11-24 ##

[v1.1.1]: https://github.com/mfederczuk/deeptools/releases/v1.1.1

### Security ###

* Updated dependencies

## [v1.1.0] - 2021-11-01 ##

[v1.1.0]: https://github.com/mfederczuk/deeptools/releases/v1.1.0

### Fixed ###

* `tsc` is not anymore needed when installing the package - this caused errors.  
  Don't know how it worked before, but it only started causing troubles for me now.

  **DeepTools** now has no regular `dependencies` anymore in general - only `devDependencies`

### Security ###

* Updated dependencies

## [v1.0.4] - 2020-04-10 ##

[v1.0.4]: https://github.com/mfederczuk/deeptools/releases/v1.0.4

### Security ###

* Updated dependencies

## [v1.0.3] - 2020-03-14 ##

[v1.0.3]: https://github.com/mfederczuk/deeptools/releases/v1.0.3

### Fixed ###

* Fixed the signatures and implementation of some functions.

## [v1.0.2] - 2019-12-13 ##

[v1.0.2]: https://github.com/mfederczuk/deeptools/releases/v1.0.2

### Fixed ###

* Imported `deepCopy` and `deepFreeze` in `safeCopy.js`

## [v1.0.1] - 2019-12-12 ##

[v1.0.1]: https://github.com/mfederczuk/deeptools/releases/v1.0.1

### Fixed ###

* Fixed the typings file

## [v1.0.0] - 2019-12-12 ##

[v1.0.0]: https://github.com/mfederczuk/deeptools/releases/v1.0.0

### Added ###

* `deepCopy`, `deepEquals`, `deepFreeze` and `safeCopy` functions
* **TypeScript** typings for all functions
