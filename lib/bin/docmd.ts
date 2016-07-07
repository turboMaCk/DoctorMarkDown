/// <reference path="../../header_files/node.d.ts" />
/// <reference path="../../header_files/mkdirp.d.ts" />
/// <reference path="../../header_files/ncp.d.ts" />
import base from '../doctor-mark-down';
import thePessimist from 'thepessimist';
import fs = require('fs');
import mkdirp = require('mkdirp');
import ncp = require('ncp');

export const defaultSettings = {
    skipFirstHeadline: false,
    files: ['README.md'],
    outputFolder: 'documentation',
    depth: '6',
};

export default function(process) {
    const shortcuts = {
        s: 'skipFirstHeadline',
        f: 'files',
        o: 'outputFolder',
        d: 'depth'
    }

    // parse settings
    const settings = thePessimist(defaultSettings, process.argv, shortcuts);

    const template = fs.readFileSync('./template/default/index.hbs', 'utf8');
    const compile = base(settings, template);

    mkdirp(`./${settings.outputFolder}`, function (err) {
        if (err) {
            return console.error(err);
        };
        const file : string = `./${settings.outputFolder}/index.html`;

        let md : string = '';
        settings.files.forEach((fileName) => {
            console.log(`File ${fileName} loaded sucessfully`);
            const fileContent : string = fs.readFileSync(fileName, 'utf8');
            md += `${fileContent}\n`;
        });

        fs.writeFileSync(file, compile(md), 'utf8')
        console.log(`File ${file} was created`);
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
