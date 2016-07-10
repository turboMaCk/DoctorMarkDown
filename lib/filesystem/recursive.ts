/// <reference path="../../header_files/node.d.ts" />
/// <reference path="../../header_files/mkdirp.d.ts" />
import fs = require('fs');
import mkdirp = require('mkdirp');
import { Fs } from './browser';
import { Node } from '../frontend/menu';
import { Compiler, CompilerFactory } from '../doctor-mark-down';

function assetsPath(pathArr : string[]) : string {
    const relevant : string[] = pathArr.slice(1);
    const path = relevant.length > 0 ? relevant.map(() => '..').join('/') + '/assets' : 'assets';
    return path;
}

function navRelevant(settings, dirs : Fs[]) : Fs[] {
    let children : Fs[] = [];
    dirs.forEach((dir) => { children = children.concat(dir.children) });
    if (children.length == 0) { return [] };
    const childFiles : Fs[] = children.filter(c => !c.children);
    const childDirs : Fs[] = children.filter(c => !!c.children);
    const withoutParent : Fs[] = childDirs.filter((dir) => {
        childFiles.forEach((file) => {
            const directory : string[] = file.path.split('/');
            directory.pop();
            if (directory.join('/') == dir.path) {
                return false;
            };
        });

        return true;
    });

    return childFiles.concat(navRelevant(settings, withoutParent));
}

function writeFile(settings, dirs : Fs[], parsed : Compiler, fileName : string, nav : Node[]) : void {
    const parseForNav : Fs[] = navRelevant(settings, dirs);
    // console.log(parseForNav, parsed.getFileName());

    fs.writeFileSync(fileName, parsed.compileWithNav(nav), 'utf8')
}

export default function(settings, compiler : CompilerFactory) {
    return function generateRecursive(res : Fs, navTree : Node[]) : void {
        const pathArr : string[] = res.path.split('/');
        const dir : string = pathArr.slice(1, pathArr.length).join('/');
        const fullPath : string = dir ? settings.outputFolder + '/' + dir : settings.outputFolder;
        const file : string = `./${fullPath}/index.html`;

        mkdirp(fullPath, function (err) {
            console.log(res);
            const files = res.children.filter(i => !i.children);
            const dirs = res.children.filter(i => !!i.children);
            // console.log(fullPath, files);

            let md : string = '';
            files.forEach((file : Fs) => {
                const fileName : string = file.path;
                const fileContent : string = fs.readFileSync(fileName, 'utf8');
                md += `${fileContent}\n`;
                // console.log(`File ${fileName} loaded sucessfully`);
            });

            const parsed : Compiler = compiler(md, assetsPath(pathArr));
            if (files.length > 0) {
                // writeFile(settings, dirs, parsed, file);
                const parseForNav : Fs[] = navRelevant(settings, dirs);
                // console.log(parseForNav, parsed.getFileName());

                const { content, navigation } = parsed.compileWithNav(navTree);
                // console.log(navigation);

                fs.writeFileSync(file, content, 'utf8')
                navTree = navigation;

                // console.log(`File ${file} was created`);
            } else {
                dirs.forEach((dir : Fs) => {
                    generateRecursive(dir, navTree);
                });
            }
        });
    }
}
