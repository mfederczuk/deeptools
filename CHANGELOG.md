<!-- markdownlint-disable MD024 -->

# Changelog #

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2021-11-01 ##

[1.1.0]: https://github.com/mfederczuk/deeptools/compare/v1.0.4...v1.1.0

### Fixed ###

* `tsc` is not anymore needed when installing the package - this caused errors.  
  Don't know how it worked before, but it only started causing troubles for me now.

  **DeepTools** now has no regular `dependencies` anymore in general - only `devDependencies`

### Security ###

* Updated dependencies

## [1.0.4] - 2020-04-10 ##

[1.0.4]: https://github.com/mfederczuk/deeptools/compare/v1.0.3...v1.0.4

### Security ###

* Updated dependencies

## [1.0.3] - 2020-03-14 ##

[1.0.3]: https://github.com/mfederczuk/deeptools/compare/v1.0.2...v1.0.3

### Fixed ###

* Fixed the signatures and implementation of some functions.

## [1.0.2] - 2019-12-13 ##

[1.0.2]: https://github.com/mfederczuk/deeptools/compare/v1.0.1...v1.0.2

### Fixed ###

* Imported `deepCopy` and `deepFreeze` in `safeCopy.js`

## [1.0.1] - 2019-12-12 ##

[1.0.1]: https://github.com/mfederczuk/deeptools/compare/v1.0.0...v1.0.1

### Fixed ###

* Fixed the typings file

## [1.0.0] - 2019-12-12 ##

[1.0.0]: https://github.com/mfederczuk/deeptools/releases/tag/v1.0.0

### Added ###

* `deepCopy`, `deepEquals`, `deepFreeze` and `safeCopy` functions
* **TypeScript** typings for all functions
