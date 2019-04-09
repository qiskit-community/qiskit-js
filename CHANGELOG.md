# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

> **Types of changes**:
>
> - 🎉 **Added**: for new features.
> - ✏️ **Changed**: for changes in existing functionality.
> - ⚠️ **Deprecated**: for soon-to-be removed features.
> - ❌ **Removed**: for now removed features.
> - 🐛 **Fixed**: for any bug fixes.
> - 👾 **Security**: in case of vulnerabilities.

## [Unreleased]

### 🎉 Added

- `@qiskit/qiskit-sim`: Introduce Gate class
- `@qiskit/qiskit-sim`: Add the identity (id) gate
- `@qiskit/qiskit-sim`: Add createCircuit factory function

### ✏️ Changed

- Update Node.js install instruction in README.md
- Update packages links in qiskit-devs

## [0.6.2] - 2019-03-13

### ✏️ Changed
- `qiskit`: Improve the return of backend related commands in the console client.

### ❌ Removed

- Tooling cleanup.

## [0.6.1] - 2019-03-12

### ✏️ Changed
- `@qiskit/devs-js`: Using new `jsqubits` version.

## [0.6.0] - 2019-03-12

### ✏️ Changed
- Node.js version update.
- `@qiskit/sdk`: Rename package to `qiskit`.
- Logo in the README.

### 🐛 Fixed
- Link to Qiskit site in the README.
- `@qiskit/cloud`: Tests, to support changes in the API.
- `@qiskit/devs-js`: Important bug to run the JS engine in Windows.

### ❌ Removed

- We don't support browser releases anymore. In 2019 everybody know how to bundle the dependencies of an application.

## [0.5.0] - 2018-10-20 (JSDay)

### ✏️ Changed

- Clearer README.
- Simpler ESLint and Prettier setup.
- `@qiskit/devs-sdk`: Easier command line client.

## [0.4.2] - 2018-09-10

### 🐛 Fixed

- `@qiskit/devs-js`: Some relative paths to specific files in dependencies.
- `@qiskit/devs-sdk`:
  - All commands depending of the userId.
  - Typo in the alias of "cloud-jobs" command.

### 🎉 Added

- `@qiskit/devs-ibmq`: Documentation for the `credits` method.
- `@qiskit/devs-sdk`: Commands `devs-random`, `devs-factor`and `devs-result`.

### ✏️ Changed

- `@qiskit/devs-ibmq`: Dropped some fields of the method `credits` which don't apply to this library.

## [0.4.1] - 2018-08-09

### ❌ Removed

- Non licensed dependencies.

## [0.4.0] - 2018-08-02

### ✏️ Changed

- Renamed `Software Kit` to `Science Kit` everywhere.
- Repository URL updated everywhere.
- More consistent documentation.
- PR and issues templates updated.
- `@qiskit/sim`: New simulator implementation and API (WIP).
- `@qiskit/devs`: The signature of the method can receive also an instance of any library it needs.

### ❌ Removed

- `@qiskit/sim`: Old implementation examples.

### 🐛 Fixed

- `@qiskit/devs-js`: The method `factor` implementation wasn't finished by error.
- `@qiskit/devs-ibmq`: The backends name was hardcoded, making some of them unavailable.

### 🎉 Added

- `@qiskit/devs-ibm`: All options documented now.

### 👾 **Security**

- Some dependencies updated.

## [0.3.0] - 2018-06-07

### 🎉 Added

- Multiple engine support to "qiskit-algos" package: ANU, JS.

### ✏️ Changed

- License header in source code files to be consistent with the rest of the projects.
- JS distribution files rebundled.
- Package "qiskit-algos" renamed to [qiskit-devs](https://github.com/Qiskit/qiskit-js/tree/master/packages/qiskit-devs).

### ❌ Removed

- A lot of repeated code.

### 🐛 Fixed

- Some documentation to reflect actual code.

## [0.2.0] - 2018-05-24

### 🎉 Added

- Doc about how to make releases easier.

### ✏️ Changed

- Minor typos in the README file.
- Following new dev guideline: code of conduct, file naming, issue/PR templates, etc.
  - Prettier support.
- Package "qiskit-qe" renamed to [qiskit-cloud](https://github.com/Qiskit/qiskit-js/tree/master/packages/qiskit-cloud).
- JS distribution files rebundled.

### ❌ Removed

- nsp dropped because now npm supports it natively.

### 🐛 Fixed

- Main README and CONTRIBUTING files.
- To support the new simulator name.

### 👾 Security

- Insecure dependencies updated.

## [0.1.9] - 2018-04-27

### 🎉 Added

- Node.js v10 support.

### ✏️ Changed

- Package "qiskit-cli" renamed to [qiskit-sdk](https://github.com/Qiskit/qiskit-js/tree/master/packages/qiskit-sdk).
- Minor improvements/fixes in the README file.

### ❌ Removed

- All "package-lock" files

### 🐛 Fixed

- Some old tests after last changes.

## [0.1.8] - 2018-04-24

### ✏️ Changed

- Good practices in the codebase, to respect new development guide.

### 🐛 Fixed

- Avoid a break when options not passed.

### 👾 Security

- Updated the library "elasticsearch" to avoid insecure dependencies.

## [0.1.7] - 2018-04-24

### 🎉 Added

- Publish scoped packages support for npm.

### 🐛 Fixed

- Copy/paste error in the main README file.

## [0.1.6] - 2018-04-24

### 🎉 Added

- Package [qiskit-algos](https://github.com/Qiskit/qiskit-js/tree/master/packages/qiskit-devs).

## [0.1.5] - 2018-2-20

### ✏️ Changed

- [Jest](https://facebook.github.io/jest) test engine for [snap-shot-it](https://github.com/bahmutov/snap-shot-it) (mocha support).
- [depcheck](https://www.npmjs.com/package/depcheck) instead [npm-check](https://www.npmjs.com/package/npm-check).
- Using native [util.promisify](https://nodejs.org/api/util.html#util_util_promisify_original) instead the external library.
- Client side libraries rebundled.

### ❌ Removed

- Not used dependencies.
- Old not needed stuff.

### 🐛 Fixed

- Minor test fail discovered after last changes.
- Change in lerna setup to allow markdown files in npm.
- Travis badge in the main README file.

<<<<<<< HEAD
[unreleased]: https://github.com/Qiskit/qiskit-js/compare/v0.6.2...HEAD
[0.6.2]: https://github.com/Qiskit/qiskit-js/compare/v0.6.1...v0.6.2
[0.6.1]: https://github.com/Qiskit/qiskit-js/compare/v0.5.0...v0.5.0
=======
[unreleased]: https://github.com/Qiskit/qiskit-js/compare/v0.6.1...HEAD
[0.6.1]: https://github.com/Qiskit/qiskit-js/compare/v0.6.0...v0.6.1
>>>>>>> 135f1d01c7d8dc5b1ee6d311b097788121d461c8
[0.6.0]: https://github.com/Qiskit/qiskit-js/compare/v0.5.0...v0.5.0
[0.5.0]: https://github.com/Qiskit/qiskit-js/compare/v0.4.2...v0.5.0
[0.4.2]: https://github.com/Qiskit/qiskit-js/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/Qiskit/qiskit-js/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/Qiskit/qiskit-js/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/Qiskit/qiskit-js/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Qiskit/qiskit-js/compare/v0.1.9...v0.2.0
[0.1.9]: https://github.com/Qiskit/qiskit-js/compare/v0.1.8...v0.1.9
[0.1.8]: https://github.com/Qiskit/qiskit-js/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/Qiskit/qiskit-js/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/Qiskit/qiskit-js/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/Qiskit/qiskit-js/compare/170b827423cb605c99c599a0be2ab526359bac76...v0.1.5
