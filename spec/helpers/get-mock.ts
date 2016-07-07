/// <reference path="../../header_files/node.d.ts" />
import fs = require('fs');

export default function(fileName : string) : string {
    return fs.readFileSync(`spec/mock/${fileName}`, 'utf8');
};
