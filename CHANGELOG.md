# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

> **Types of changes**:
>
> * 🎉 **Added**: for new features.
> * ✏️ **Changed**: for changes in existing functionality.
> * ⚠️ **Deprecated**: for soon-to-be removed features.
> * ❌ **Removed**: for now removed features.
> * 🐛 **Fixed**: for any bug fixes.
> * 👾 **Security**: in case of vulnerabilities.

## [Unreleased]

### ✏️ Changed

* Renamed "Software Kit" to "Science Kit" everywhere.
* Repository URL updated everywhere.
* Simulator implementation and API (WIP).

## [0.3.0] - 2018-06-07

### 🎉 Added

* Multiple engine support to "qiskit-algos" package: ANU, JS.

### ✏️ Changed

* License header in source code files to be consistent with the rest of the projects.
* JS distribution files rebundled.
* Package "qiskit-algos" renamed to [qiskit-devs](https://github.com/Qiskit/qiskit-js/tree/master/packages/qiskit-devs).

## [0.2.0] - 2018-05-24

### 🎉 Added

* Doc about how to make releases easier.

### ✏️ Changed

* Minor typos in the README file.
* Following new dev guideline: code of conduct, file naming, issue/PR templates, etc.
  * Prettier support.
* Package "qiskit-qe" renamed to [qiskit-cloud](https://github.com/Qiskit/qiskit-js/tree/master/packages/qiskit-cloud).
* JS distribution files rebundled.

### ❌ Removed

* nsp dropped because now npm supports it natively.

### 🐛 Fixed

* Main README and CONTRIBUTING files.
* To support the new simulator name.

### 👾 Security

* Insecure dependencies updated.

## [0.1.9] - 2018-04-27

### 🎉 Added

* Node.js v10 support.

### ✏️ Changed

* Package "qiskit-cli" renamed to [qiskit-sdk](https://github.com/Qiskit/qiskit-js/tree/master/packages/qiskit-sdk).
* Minor improvements/fixes in the README file.

### ❌ Removed

* All "package-lock" files

### 🐛 Fixed

* Some old tests after last changes.

## [0.1.8] - 2018-04-24

### ✏️ Changed

* Good practices in the codebase, to respect new development guide.

### 🐛 Fixed

* Avoid a break when options not passed.

### 👾 Security

* Updated the library "elasticsearch" to avoid insecure dependencies.

## [0.1.7] - 2018-04-24

### 🎉 Added

* Publish scoped packages support for npm.

### 🐛 Fixed

* Copy/paste error in the main README file.

## [0.1.6] - 2018-04-24

### 🎉 Added

* Package [qiskit-algos](https://github.com/Qiskit/qiskit-js/tree/master/packages/qiskit-devs).

## [0.1.5] - 2018-2-20

### ✏️ Changed

* [Jest](https://facebook.github.io/jest) test engine for [snap-shot-it](https://github.com/bahmutov/snap-shot-it) (mocha support).
* [depcheck](https://www.npmjs.com/package/depcheck) instead [npm-check](https://www.npmjs.com/package/npm-check).
* Using native [util.promisify](https://nodejs.org/api/util.html#util_util_promisify_original) instead the external library.
* Client side libraries rebundled.

### ❌ Removed

* Not used dependencies.
* Old not needed stuff.

### 🐛 Fixed

* Minor test fail discovered after last changes.
* Change in lerna setup to allow markdown files in npm.
* Travis badge in the main README file.

[unreleased]: https://github.com/Qiskit/qiskit-js/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/Qiskit/qiskit-js/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Qiskit/qiskit-js/compare/v0.1.9...v0.2.0
[0.1.9]: https://github.com/Qiskit/qiskit-js/compare/v0.1.8...v0.1.9
[0.1.8]: https://github.com/Qiskit/qiskit-js/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/Qiskit/qiskit-js/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/Qiskit/qiskit-js/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/Qiskit/qiskit-js/compare/170b827423cb605c99c599a0be2ab526359bac76...v0.1.5
