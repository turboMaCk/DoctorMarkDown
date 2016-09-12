# File System Tools

File system tolls helps with resolving all source files that should be compile.
This is the most important weapon of Doctor Mark Downt.

Based on `--files` and `--recursive` options.
These tools walks files and build datastructure which is then used for loading all source files and setting paths during compilation.
Location of files is significant for output structure.


## Non-Recursice Mode

In non recursive mode all `--files` are grabed from folder where comand is runned.
This mode do not provide `{{{navigation}}}` and will output only one html file (and some assets).
However `{{menu}}` is generated based on headline structure of files passed in.
This mode is usually good for small descriptions of project.

## Recursive Mode

When `--recursive` or `-r` is passed whole structure (beside `--igonere` / `-i` directories) is walked and all files listed in `--files` option are found.
The result is datastructure containing all valid files. It's *not* a problem if there is missing hit on any level - this is resolved during this step.
Result of this mode will be documentation structured the same way as where files was found.
Previous hits in every branch are significant for lavels in menu. Anyway structure of output is still the same as location in source.
This means file can be on different lavel in fs as it is in menu. This guarantees links will be same between html and source and still it's
not required to make menu level for irelevant filesystem levels (Think about Java:D).
This mode is usable when you want to make larger documentation - document every module or resource group you possibly have.
