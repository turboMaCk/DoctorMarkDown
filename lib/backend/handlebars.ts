///<reference path="../../header_files/handlebars.d.ts"/>
import Handlebars = require('handlebars');
import BackendFactory, { Data, ParserFactory, Parser, Backend } from './base';

const parser : Parser = function(settings, template : string, data : Data) : string {
    const compile = Handlebars.compile(template);
    return compile(data);
}

const backend : ParserFactory = BackendFactory(parser);
export default backend;
