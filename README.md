# Doctor Mark Down

Markdown to Html compiler for creating simple documentations that scales with your project.

## Why?

Maintaining documentation is booring and time consuming. There are various tools for generating documentation directly
from comments in your source files. This is all fine but sometimes is really hard to maintain comments for every function or method in your project
and usually it's even harder to maintain large comments blocks than actually changing implementation.
Also it reuire really big enfort to generate nice documentation and make it impossible for non technical people to contribute to the stuff.

The other alternative is to use Jekyll or similar tool for generating documentation but neither this solution is perfect.
You'll fight with Blog like structure most static site generators using by default. Mostly it will force you tu put docuemntation files
to some dedicated folder and this is when troubles starts. Maintanance is expensive and this is why you probably wants both:

* Having your documentation live along with source code
* Write it as a plain Markdown and document only the bits that matters

This is exactly what **Docktor Mark Down** tries to solve. It respect Github like structure.
This means documentation will be accessible and redable via Github, Bitbucker or similar service as well as locally accesible
alongside with source within your repository. **Doctor Mark Down** just helps you to easily compile these files into HTML you can publish where ever you want.

## Instalation

Docktor Mark Down is written in typescript and available via npm.

```shell
npm install -g docktor-mark-down
```

You can also use library level version if you want and use public APIs in your projects:

```shell
npm install --save docktor-mark-down
```

## Settings

All settings are optional. Anyway you should use them to overwrite default values. Here is list of available options


| Name | Shortcut | Default | Description
|------|----------|---------|------------
| `--files` | `-f`| `["README.md"]` | List of source files
| `--skip-first-headline` | `-s` | `false` | Skip first headline in menu tree
| `--output-folder` | `-o` | `"documentation"` | Compiled files will be stored to this folder
| `--depth` | `-d` | `6` | Depth limit of navigation tree
| `--template` | `-t` | `default` | Path to template

### Creating custom template

[Default](template/default) template not other is provided via options. For now the only handlebars backend is provided.
Anyway by design it should be pretty easy to extend current functionality with support for various different templating languages.

There are only two requirements for creating your own template for **Docktor Mark Down**. Every template should contain `index.hbs` file
and `assets` folder with all other assets.

You can create new template directly in your project. For example create folder `documentation_template`. Like this:

```shell
documentation_template
 |- assets
 |  |- style.css
 |- index.hbs
```

There are two dynamic parts currently provided by parser - `menu` and `content`.
The really simple `index.html` then can look like for example this:

```handlebars
<!doctype html>
<html>
<body>
  <nav>{{{menu}}}</nav>
  <main>{{content}}</main>
</body>
</html
```

You can then compile documentation using your custom template by running:

```shell
docmd --template docuemntation_template
# or
docmd --t docuemntation_template
```
