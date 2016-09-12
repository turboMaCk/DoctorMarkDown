# Contributing

All sorts of contributions are wellcome. You fork or clone this repository.

Most of the tasks are already automated using npm scripts.

## Dependencies

Node.js should be the only requirement. Anyway this was not tested using Windows.
If you ran into some troubles feel free to open issue.

### Install dependencies

```shell
npm install
```

## Running Tests

Jasmine test framework is used. The most important parts are tested. There are still few things that can be test more deeply.
Anyway Typescript provides some extra safety over JavaScript so there is not need to write any large integration tests.
If you plan to contribute to this repository always think about providing PR with tests case by case.
Its usually good to have at least one test per PR if you fixing bug or providing new feature.

```shell
npm test
```

## Build project

Source is written in typescript. You can comple javascript running `build` command as follows:

```shell
npm run build
```

This will egenerate `dist` folder containing whole project files. This folder is ignored by git.
This step is required if you want to execute `./bin/docmd`.

### DOCMD Docktor Mark Down

You can compile Docktor Mark Down documentation for Docktor markdow itsef. This will build project (same as running `npm run build`)
and use builded `bin/docmd` for generating documentation:

```shell
npm start
```

## Improvements I Can Think of...

- [ ] Assets supprt
  - [ ] Custom parser for links
  - [ ] Linked assets copying
- [ ] Improve links parsing
  - [ ] Link `/index.html` to make links work without server
- [ ] Passing start path within cmd line (like `docmd ~/somewhere`)
- [ ] Configuration file
  - [ ] Fs (levels up) looker for config file
  - [ ] Load options from config file (`.docmd.rc` / `docmd.json`...)
  - [ ] Custom footers/names and other meta (loaded from)
- [ ] Pass datastructure instead of HTML to navigation and menu
  - [ ] Some recursive `menu-item` helper?
  - [ ] Add state to manu item (`acessor` & `active` flags)
