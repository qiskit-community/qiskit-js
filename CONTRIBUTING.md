# Contributing

**We appreciate all kinds of help, so thank you!** :clap: :kissing_heart:

You can contribute in many ways to this project.

## Issue reporting

:fire: This is a goog point to start, when you find a problem please add it to the [issue traker](https://github.com/IBMResearch/qiskit/issues).

## Doubts solving

:two_women_holding_hands: To help less advanced users is another wonderful way to start. You can help us to close some opened issues. This kind of tickets should be labeled as `question`.

## Improvement proposal

:smiling_imp: If you have an idea for a new feature please open a ticket labeled as `enhancement`. If you could also add a piece of code with the idea or a partial implementation it would be awesome.

## Documentation

:eyes: We all know the doc always need fixes/upgrades :wink:, so please feel free to send a PR (see next point) with what you found.

## Code

:star: This section include some tips that will help you to push source code.

### Doc

Review the parts of the documentation regarding the new changes and update it if it is needed.

### License

All our open source sofware is published under the [Apache 2.0 license](http://www.apache.org/licenses/LICENSE-2.0.txt).

Please, add your name in the head comment of each file you contribute to (under the tag "Authors").

### Pull requests

- We use [GitHub pull requests](https://help.github.com/articles/about-pull-requests) to accept the contributions.
- Review the parts of the documentation regarding the new changes and update it if it's needed.
- New features often imply changes in the existent tests or new ones are needed. Once they're updated/added please be sure they keep passing.

### Commits

Please follow the next rules for the commit messages:

- It should be formed by a one-line subject, followed by one line of white space. Followed by one or more descriptive paragraphs, each separated by one line of white space. All of them finished by a dot.
- If it fixes an issue, it should include a reference to the issue ID in the first line of the commit.
- It should provide enough information for a reviewer to understand the changes and their relation to the rest of the code.

From here, depending of the nature of the project, we have specific recommendations about the code style, the debuggins engine or how to run the tests and the rest of security checks. Please visit the one regarding your project.

# Node.js

## Environment

- A better way to install [Node.js](https://nodejs.org) for developers is to use [nvm](https://github.com/creationix/nvm), to test different versions.
- Get the code and install all dependencies:

```sh
git clone https://github.com/IBM/qiskit
cd qiskit
npm i
```

### Style guide

Submit clean code and please make effort to follow existing conventions in order to keep it as readable as possible. We love ES6, so we use [ESLint](http://eslint.org/) and the [Airbnb](https://github.com/airbnb/javascript) style guide. It's the most complete, so it forces the developers to keep a consistent style. Please run to be sure your code fits with it:

```sh
npm run lint
```

### Test

We've chosen the [Mocha](https://mochajs.org) testing engine with the core ["assert"](https://nodejs.org/api/assert.html) module.

```sh
npm test
```

This command also checks for:

- Style linting.
- Outdated/lost/unused dependencies.
- Insecure dependencies.

### Debugging

To debug we use the [visionmedia module](https://github.com/visionmedia/debug). So you have to use the proper environment variable with the name of the project:

```sh
DEBUG=qiskit* npm start
DEBUG=qiskit:bin* npm start
```

## Deploy

In the projects which a deployment to Bluemix is required we include a couple of shortcuts:

```sh
npm run deploy-develop
npm run deploy-production
```

## Releases

For the libraries we have those to publish to npm. Both use [release-it](https://www.npmjs.com/package/release-it) under the hood:

```sh
npm run release
npm run release-major
```

## Metrics

For HTTP API projects we use the [Node application metrics](https://developer.ibm.com/open/openprojects/node-application-metrics) dashboard.

```sh
npm run metrics # local
npm run metrics-develop
npm run metrics-production
```
