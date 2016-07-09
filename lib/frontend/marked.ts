///<reference path="../../header_files/highlight.d.ts"/>
///<reference path="../../header_files/marked.d.ts"/>

import marked = require('marked');
import highlight = require('highlight.js');
import FrontendFactory, { parseTree, pushDepthToTree, Frontend, ParserFactory, Token as BaseToken } from './base';
import { Node } from './menu';

// Setup code highlighting
marked.setOptions({
    highlight(code : string) : string {
        return highlight.highlightAuto(code).value;
    }
});

interface Token extends BaseToken {
    type : string;
};

// @Private Marked Frontend
const frontend : Frontend = {
    tokenize(options, raw) {
        return marked.lexer(raw);
    },
    parseContent(options, tokens) {
        return marked.parser(tokens);
    },
    parseMenuTree(options, tokens : Token[]) {
        return parseTree(options, tokens.filter(i => i.type == 'heading' && i.depth <= parseInt(options.depth)));
    },
    parseNavTree(options, navTree : Node[], tokens : Token[]) : Node[] {
        const firstHeading = tokens.filter(i => i.type == 'heading')[0];
        return pushDepthToTree(options, navTree, [firstHeading].filter(h => !!h));
    },
    getFileName(options, tokens : Token[]) : string {
        const firstHeading = tokens.filter(i => i.type == 'heading')[0];
        return firstHeading ? firstHeading.text : '';
    }
};

// @Public export parser
const parser : ParserFactory = FrontendFactory(frontend);
export default parser;
