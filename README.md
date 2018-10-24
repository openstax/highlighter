# Highlighter
Functionality for OpenStax note taking features including:
- serializing highlights
- deserializing highlights
- versioned serialization strategies
- extracting highlighted content
- loading wrappers for styling highligted content
- managing focus/scrolling to highlights

## Setup

install [nvm](https://github.com/creationix/nvm#installation)

```bash
# use the right version of node
nvm install

# install yarn, skip if you have it already
npm install -g yarn

# install dependencies
yarn
```

## To run in development

run these in separate terminals as you develop

```bash
# typescript type checking
yarn watch:ts

# unit tests
yarn watch:test
```

### reference changes from another project

do [yarn link](https://yarnpkg.com/lang/en/docs/cli/link/)

```bash
# watch for code changes and re-compile:
yarn watch
```

## to deploy
```bash
# do build
yarn build:clean

# push to npm (this updates package.json and makes a git tag)
yarn publish [--minor|--major|--patch]

# push to github
git push origin v$(yarn -s current)

# PR the version bump back into master (skip this for weirdo beta or release candidate tags)
open https://github.com/openstax/highlighter/compare/master...v$(yarn -s current)?expand=1
```
