/// <reference path="../../header_files/node.d.ts" />
import fs = require("fs");

export interface Fs {
    path: string;
    children?: Fs[];
};

export interface FsHandler extends Function {
    (err, tree? : Fs);
};

export interface FsTree extends Function {
    (dir : string, done : FsHandler) : void;
}

function createFsNode(dir : string, name? : string) : Fs {
    const path = !!name ? `${dir}/${name}` : dir;
    return { path: path };
}

export default function Tree(settings) : FsTree {
    function tree (dir : string, done : FsHandler) {
        let results : Fs = createFsNode(dir);
        results.children = [];

        fs.readdir(dir, function(err, list) {
            if (err) {
                return done(err);
            }

            let pending : number = list.length;

            if (!pending) {
                return done(null, results);
            }

            settings.files.forEach((fileName) => {
                if (list.filter(f => f == fileName)[0]) {
                    results.children.push(createFsNode(dir, fileName));
                }
            });

            list.forEach((file) => {
                fs.stat(`${dir}/${file}`, (err, stat) => {
                    if (stat && stat.isDirectory() && settings.recursive) {
                        // check if is ignored
                        if (settings.ignore.filter(name => name == file).length == 0) {
                            return tree(`${dir}/${file}`, (err, res) => {
                                if (res.children.length > 0) {
                                    const childFiles = res.children.filter(i => !i.children);
                                    if (childFiles.length > 0) {
                                        results.children.push(res);
                                    } else {
                                        results.children = results.children.concat(res.children);
                                    }
                                }

                                if (!--pending) {
                                    done(null, results);
                                }
                            });
                        }
                    }
                    if (!--pending) {
                        done(null, results);
                    }
                });
            });
        });
    }

    return tree;
}
