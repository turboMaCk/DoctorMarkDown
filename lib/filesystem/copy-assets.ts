/// <reference path="../../header_files/node.d.ts" />
/// <reference path="../../header_files/mkdirp.d.ts" />
/// <reference path="../../header_files/ncp.d.ts" />
import mkdirp = require('mkdirp');
import ncp = require('ncp');

export default function(settings) {
    mkdirp(`./${settings.outputFolder}/assets`, (err) => {
        if (err) return console.error(err);

        ncp.ncp('template/default/assets', `./${settings.outputFolder}/assets`, (err) => {
            if (err) return console.error(err);
            console.log('Assets copied sucesfully.');
        });
    });
}
