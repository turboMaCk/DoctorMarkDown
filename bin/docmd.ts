/// <reference path="../header_files/node.d.ts" />
import base from '../lib/doctor-mark-down';
import thePessimist from 'thepessimist';
import fs = require('fs');

const def = {
    file: 'README.md',
    output: 'index.html'
};

const settings = thePessimist(def, process.argv);

const template = fs.readFileSync('./template/default/index.hbs', 'utf8');
const compile = base(settings, template);

const md = fs.readFileSync(settings.file, 'utf8');
fs.writeFileSync('./' + settings.output, compile(md), 'utf8')
console.log('File created');
