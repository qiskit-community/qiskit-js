# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

* Following new dev guideline: code of conduct, file naming, issue/PR templates, etc.
  * Prettier support.
* Doc about how to make releases easier.
* JS distribution files rebundled.
* nsp dropped because now npm supports it natively.

### Changed

* Minor typos in the README file.

## [0.1.9] - 2018-04-27

### Added

* Node.js v10 support.

### Changed

* Package "qiskit-cli" renamed to [qiskit-sdk](https://github.com/QISKit/qiskit-sdk-js/tree/master/packages/qiskit-sdk).
* Minor improvements/fixes in the README file.

### Deleted

* All "package-lock" files

### Fixed

* Some old tests after last changes.

## [0.1.8] - 2018-04-24

### Changed

* Updated the library "elasticsearch" to avoid insecure dependencies.
* Good practices in the codebase, to respect new development guide.

### Fixed

* Avoid a break when options not passed.

## [0.1.7] - 2018-04-24

### Added

* Publish scoped packages support for npm.

### Fixed

* Copy/paste error in the main README file.

## [0.1.6] - 2018-04-24

### Added

* Package [qiskit-algos](https://github.com/QISKit/qiskit-sdk-js/tree/master/packages/qiskit-algos).

## [0.1.5] - 2018-2-20

### Deleted

* Old not needed stuff.

### Changed

* [Jest](https://facebook.github.io/jest) test engine for [snap-shot-it](https://github.com/bahmutov/snap-shot-it) (mocha support).
* [depcheck](https://www.npmjs.com/package/depcheck) instead [npm-check](https://www.npmjs.com/package/npm-check).
* Using native [util.promisify](https://nodejs.org/api/util.html#util_util_promisify_original) instead the external library.
* Client side libraries rebundled.

### Fixed

* Minor test fail discovered after last changes.
* Change in lerna setup to allow markdown files in npm.
* Travis badge in the main README file.

### Deleted

* Not used dependencies.

[unreleased]: https://github.com/QISKit/qiskit-sdk-js/compare/v0.1.9...HEAD
[0.1.9]: https://github.com/QISKit/qiskit-sdk-js/compare/v0.1.8...v0.1.9
[0.1.8]: https://github.com/QISKit/qiskit-sdk-js/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/QISKit/qiskit-sdk-js/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/QISKit/qiskit-sdk-js/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/QISKit/qiskit-sdk-js/compare/170b827423cb605c99c599a0be2ab526359bac76...v0.1.5
