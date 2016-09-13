/// <reference path="../../header_files/node.d.ts" />
import base from '../doctor-mark-down';
import thePessimist from 'thepessimist';
import fs = require('fs');
import Browser from '../filesystem/browser';
import generatorFactory from '../filesystem/generator';
import copyAssets from '../filesystem/copy-assets';

const dirArray : string[] = __dirname.split('/');
// remove dist/lib/bin/
['dist', 'lib', 'bin'].forEach(dir => dirArray.pop());
const baseDir : string = dirArray.join('/');

export const defaultSettings = {
    recursive: false,
    skipFirstHeadline: false,
    files: ['README.md'],
    outputFolder: 'docs',
    depth: '6',
    template: `${baseDir}/template/default`,
    ignore: ['node_modules', '.git', 'documentation', 'bower_components']
};

export default function(process) {
    const shortcuts = {
        r: 'recursive',
        s: 'skipFirstHeadline',
        f: 'files',
        o: 'outputFolder',
        d: 'depth',
        t: 'template',
        i: 'ignore'
    };

    // parse settings
    const settings = thePessimist(defaultSettings, process.argv, shortcuts);
    const template = fs.readFileSync(`${settings.template}/index.hbs`, 'utf8');
    const compiler = base(settings, template);
    const browser = Browser(settings);

    const generator = generatorFactory(settings, compiler);
    browser('.', (err, res) => {
        if (err) return console.error(err);
        generator(res);
    });

    copyAssets(settings);
};
