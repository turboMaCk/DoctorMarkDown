# Doctor Mark Down

Markdown to Html compiler for creating simple documentation that scales with your project.
You can browse this document as part of documentation generated by **Doctor Mark Down** itself on its [GitHub Pages](http://turbomack.github.io/DoctorMarkDown).

## Why?

Maintaining documentation is expensive. There are many tools that tries to address this issue out there. Some of them uses different aproaches
some of them are pretty similar and differs only in features, API or implementation. **Doctor Mark Down** is not an alternative to any of these
(or at least I do not know any of tool using the same aproach). To be clear there is no one good way to solve every case.
**You should probably consider if Doctor Mark Down fits your needs before you use it in your project.** The reason I wrote Doctor Mark Down is
that I missed the tool which fits my needs for some of my projects or projects I came across with my coleagues & collaborators.
Documentation should be both accesible (think about easy HTML compilation) and easy to maintain (think about keeping it up to date with your project).

### How is Doctor Mark Down do NOT Works

The most common solution is generate documentation directly from source files using its comments.
This approach has its advantages and disadvantages. The good thing is that documentation lives directly besides source code it refers to.
It's easy to track comments updates when implementation changes and also it's supper easy to automate documentation deploy during release etc.
Another important thing might be that it's supper easy to access documentation when someone works with source directly.
The down side (or at least I think) is that it's really hard to know how actual documentation will look like based on source (comments in source code).
Also if you start to adding examples and description in your comments it starts to be quite hard to navigate your actual implementation.
Often comments starts to be even larger than actual code which is not cool. I found it's usually hard to keep comments up to date especially when
you're spiking some experimental feature. It's also hard to update coments afterwards or decide which part of your code needs to be docummented deeply
and which implementation detail doesn't need to be documented at all. Super annoying thing can be when you for some reason need to switch to different tool
and realise that structure of your comments is not compatible with new approach (new tool expect different structure). Personally I do not comment
my source too much in favour of test/spec suit which descibes API anyway and is proven correct. Anyway still you'll probably need at least some
solution for documenting public API especially for libraries.

Another approach I came around few times is to use **static site generator** like Jekyll. With this kind of tool the documentation written in
some nice markup language (like mark down) and using some template for HTML export. This is nice because you don't need to care about some weird parser which
comments generator usually uses. Also creating custom templates is supper familiar and documentation can be updated by non-technical people.
Anyway you lost some of the great features of comment approach has. For example your documentation no longer lives together with your implementation.
Even if they share same repository, usually you need to put all Markdown files in some `_posts` folder etc. Then you have to think
about both structure of your modules and your documentation. It's also harder to keep a track of which part of documetation needs to be updated
if some implementation changes. Also links in your documentation does not corespond with structure of your code anymore
and you loose the benefit of easy accessibility for developers working with source directly.

### How is Doctor Mark Down Works

**Doctor Mark Down** is not better in any of these categories but it comes with reasonable compromise between both.
Its approch is simple. It **uses markdown files** instead of comments but these files live beside actuall implementation.
Routes of generated html reflect structure of fils so **links works across local copy, Github and generated HTML**.
It lets you easily define custom templates using templating language with your custom CSS and JS.
It offers out of the box **syntax highlighting**. It **lets you decide what is worth documenting and what not**.

## Instalation

Doctor Mark Down is written in typescript and available via npm as compilated javascript package.

```shell
npm install -g doctor-mark-down
```

You can also use library level version if you want and use public APIs in your projects:

```shell
npm install --save doctor-mark-down
```

## Usage

If you have doctor-mark-down globaly instaled, you should be able to run this command from terminal.

```shell
docmd [options]
```

## Options

All options are optional. Anyway you should use them to overwrite default values. Here is list of available options

| Name | Shortcut | Default | Description
|------|----------|---------|------------
| `--recursive` | `-r` | `off` | Recursive mode
| `--files` | `-f`| `["README.md"]` | List of source files
| `--skip-first-headline` | `-s` | `false` | Skip first headline in menu tree (only for non recursive)
| `--out-folder` | `-o` | `"docs"` | Compiled files will be stored to this folder
| `--depth` | `-d` | `6` | Depth limit of navigation tree (only for non recursive)
| `--template` | `-t` | `default` | Path to template
| `--ignore` | `-i` | `node_modules .git documentation, bower_components` | Ignored directories

For explanation of how recursive and basic mode [here](lib/filesystem)
You can find complete guide for templating [here](template)

# State of Art

**Please be aware that this package is in state of Experiment/Proof of concept stage.
This means API can or can't change heavilly over time. There is no guarantees that this software will hit stable release
or will be maintain for long time. If you found this project interesting please consider any contribution to make stable release happen.**
