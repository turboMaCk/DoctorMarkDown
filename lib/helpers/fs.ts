/// <reference path="../../header_files/node.d.ts" />
import fs = require("fs");


function Tree(settings) {
    function tree (dir : string, done : Function) {
        let results = {
            "path": dir,
            "children": []
        };

        fs.readdir(dir, function(err, list) {
            if (err) {
                return done(err);
            }

            let pending = list.length;

            if (!pending) {
                return done(null, results);
            }

            list.forEach((file) => {
                fs.stat(dir + '/' + file, (err, stat) => {
                    // is is derectory
                    if (stat && stat.isDirectory()) {
                        if (settings.ignore.filter(name => name == file).length > 0) {
                            if (!--pending) {
                                done(null, results);
                            }

                            return;
                        }

                        tree(dir + '/' + file, (err, res) => {
                            if (res.children.length > 0) {
                                results.children.push(res);
                            }

                            if (!--pending) {
                                done(null, results);
                            }
                        });
                    // push files
                    } else {
                        if (settings.files.filter(name => name == file).length > 0) {
                            results.children.push({"path": dir + "/" + file});
                        }

                        if (!--pending) {
                            done(null, results);
                        }
                    }
                });
            });
        });
    }

    return tree;
}

export default function(settings, done) {
    const tree = Tree(settings);
    tree('.', done);
};
