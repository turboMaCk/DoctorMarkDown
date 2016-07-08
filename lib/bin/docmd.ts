/// <reference path="../../header_files/node.d.ts" />
/// <reference path="../../header_files/mkdirp.d.ts" />
/// <reference path="../../header_files/ncp.d.ts" />
import base from '../doctor-mark-down';
import thePessimist from 'thepessimist';
import fs = require('fs');
import mkdirp = require('mkdirp');
import ncp = require('ncp');
import fsHelper from '../helpers/fs';

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

function assetsPath(pathArr : string[]) : string {
    const relevant : string[] = pathArr.slice(1);
    const path = relevant ? relevant.map(() => '..').join('/') + '/assets' : 'assets';
    return path;
}

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
    const compile = base(settings, template);

    mkdirp(`./${settings.outputFolder}`, function (err) {
        if (err) {
            return console.error(err);
        };

        function generateRecursive(res) {
            const pathArr : string[] = res.path.split('/');
            const dir : string = pathArr.slice(1, pathArr.length).join('/');
            const fullPath : string = dir ? settings.outputFolder + '/' + dir : settings.outputFolder;
            const file : string = `./${fullPath}/index.html`;

            mkdirp(fullPath, function (err) {
                const files = res.children.filter(i => !i.children);
                const dirs = res.children.filter(i => !!i.children);

                let md : string = '';
                files.forEach((file) => {
                    const fileName : string = file.path;
                    const fileContent : string = fs.readFileSync(fileName, 'utf8');
                    md += `${fileContent}\n`;
                    console.log(`File ${fileName} loaded sucessfully`);
                });

                fs.writeFileSync(file, compile(md, assetsPath(pathArr)), 'utf8')
                console.log(`File ${file} was created`);

                dirs.forEach((dir) => {
                    generateRecursive(dir);
                });
            });
        }

        if (settings.recursive) {
            fsHelper(settings, (err, res) => {
                if (err) {
                    return console.error(err);
                }
                generateRecursive(res)
            });
        } else {

            const file : string = `./${settings.outputFolder}/index.html`;

            let md : string = '';
            settings.files.forEach((fileName) => {
                const fileContent : string = fs.readFileSync(fileName, 'utf8');
                md += `${fileContent}\n`;
                console.log(`File ${fileName} loaded sucessfully`);
            });

            fs.writeFileSync(file, compile(md), 'utf8')
            console.log(`File ${file} was created`);
        }

    });

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
