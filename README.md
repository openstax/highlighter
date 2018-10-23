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

watch for code changes and re-compile:
```bash
yarn watch
```

## to deploy
- `yarn build:clean`
- [yarn publish](https://yarnpkg.com/lang/en/docs/cli/publish/)
