# Creating Custom Template

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

```handlebars
<!doctype html>
<html>
<body>
  <nav>{{{menu}}}</nav>
  <main>{{{content}}}</main>
</body>
</html
```

You can then compile documentation using your custom template by running:

```shell
docmd --template documentation_template
# or
docmd --t documentation_template
```

## Api

There are three for parts currently provided by parser - `menu`, `navigation`, `content` and `assetPath`.
Really simple `index.html` can look like for example this:

| value | description |
|-------|-------------|
| `menu` | Structure of current page with links (based on headlines) |
| `navigation` | Menu of all ducuments in repository (using `--recursive`) |
| `content` | HTML content of currently opened document |
| `assetPath` | folder where assets are located (relative to currently opened document) |
