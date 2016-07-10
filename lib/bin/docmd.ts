/// <reference path="../../header_files/node.d.ts" />
/// <reference path="../../header_files/mkdirp.d.ts" />
/// <reference path="../../header_files/ncp.d.ts" />
import base from '../doctor-mark-down';
import thePessimist from 'thepessimist';
import fs = require('fs');
import mkdirp = require('mkdirp');
import ncp = require('ncp');
import browser from '../filesystem/browser';
import generateRecursive from '../filesystem/recursive';

const dirArray : string[] = __dirname.split('/');
// remove dist/lib/bin/
['dist', 'lib', 'bin'].forEach(dir => dirArray.pop());
const baseDir : string = dirArray.join('/');


export const defaultSettings = {
    recursive: true,
    skipFirstHeadline: false,
    files: ['README.md'],
    outputFolder: 'documentation',
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

    if (settings.recursive) {
        const recursive = generateRecursive(settings, compiler);
        browser(settings, (err, res) => {
            if (err) {
                return console.error(err);
            }
            recursive(res, []);
        });
    } else {
        mkdirp(`./${settings.outputFolder}`, function (err) {
            if (err) {
                return console.error(err);
            };

            const file : string = `./${settings.outputFolder}/index.html`;

            let md : string = '';
            settings.files.forEach((fileName) => {
                const fileContent : string = fs.readFileSync(fileName, 'utf8');
                md += `${fileContent}\n`;
                console.log(`File ${fileName} loaded sucessfully`);
            });

            fs.writeFileSync(file, compiler(md).compile(), 'utf8')
            console.log(`File ${file} was created`);

        });
    }

    // copy assets
    mkdirp(`./${settings.outputFolder}/assets`, function (err) {
        if (err) {
            return console.error(err);
        };
        ncp.ncp('template/default/assets', `./${settings.outputFolder}/assets`, function (err) {
            if (err) {
                return console.error(err);
            }
            console.log('Assets copied sucesfully');
        });
    });
};
