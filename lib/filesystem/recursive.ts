/// <reference path="../../header_files/node.d.ts" />
/// <reference path="../../header_files/mkdirp.d.ts" />
import fs = require('fs');
import mkdirp = require('mkdirp');
import { createNode, pushDepthToTree } from '../frontend/base';
import { Fs } from './browser';
import { Node } from '../frontend/menu';
import { Compiler, CompilerFactory } from '../doctor-mark-down';

function assetsPath(pathArr : string[]) : string {
    const relevant : string[] = pathArr.slice(1);
    const path = relevant.length > 0 ? relevant.map(() => '..').join('/') + '/assets' : 'assets';
    return path;
}

function walk(settings, dirs : Fs[], compilerFactory : CompilerFactory, navTree : Node[], dest? : string, compiler? : Compiler) {
    const nextLevel = dirs.map((d : Fs)=> {
        const files = d.children.filter(c => !c.children);
        const dirs = d.children.filter(c => !!c.children);
        const pathArr : string[] = d.path.split('/');
        const dir : string = pathArr.slice(1, pathArr.length).join('/');
        const fullPath : string = dir ? settings.outputFolder + '/' + dir : settings.outputFolder;

        let md = '';
        files.forEach((file) => {
            const fileName : string = file.path;
            const fileContent : string = fs.readFileSync(fileName, 'utf8');
            md += `${fileContent}\n`;
        });

        const compiler = compilerFactory(md, assetsPath(pathArr));
        return {
            compiler: compiler,
            destination: fullPath,
            fs: dirs
        }
    });
    console.log(dest);
    console.log('sd', navTree);
    const nav : Node[] = nextLevel.map(l => createNode(l.compiler.getFileName(), '/' + l.destination + '/index.html'));
    const newNavTree : Node[] = pushDepthToTree(settings, navTree, nav);
    console.log(newNavTree);
    console.log('=============')

    if (compiler) {
        mkdirp(dest, function (err) {
            if (err) return console.log(err);
            const result = compiler.compileWithNav(newNavTree);

            fs.writeFileSync(dest + '/index.html', result.content, 'utf8');
        });
    }

    nextLevel.forEach((l) => {
        walk(settings, l.fs, compilerFactory, newNavTree, l.destination, l.compiler);
    });
}

export default function(settings, compilerFactory : CompilerFactory) {
    return function generateRecursive(level : Fs) : void {
        return walk(settings, [level], compilerFactory, []);
    }
}
