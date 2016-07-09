import { NodeItem, Node } from './menu';

export interface Token {
    depth : number;
    text : string;
    type : string;
};

export interface Parser {
    getTokens() : any;
    parseMenuTree() : Node[];
    parseContent() : string;
    parseNavTree() : Node[];
}

export interface Frontend {
    tokenize(options, raw : string) : any;
    parseContent(options, tokens : any) : string;
    parseMenuTree(options, tokens : Token[]) : Node[];
    parseNavTree(options, tree : Node[], tokens : Token[]) : Node[];
};


export interface ParserFactory extends Function {
    (options, raw : string, navTree) : Parser
}

// @Private function for generating ids
// TODO: generate uniq values (iterator integer?)
function idFromText(text : string) : string {
    return text.toLowerCase().replace(/[^\w]+/g, '-');
}

// @Private Node constructor
function createNodeFromToken(token : Token, href? : string) : Node {
    href = href || `#${idFromText(token.text)}`;
    return { item: { text: token.text, href: href, depth: token.depth },
             children: [] };
}

// @Public Main constructor
export default function (frontend : Frontend) : ParserFactory {
    return (options, raw : string, navTree) : Parser => {
        let tokenized;

        const getTokens = () : any => {
            return tokenized ? tokenized : frontend.tokenize(options, raw)
        };

        const parseMenuTree = () : Node[] => {
            return frontend.parseMenuTree(options, getTokens());
        };

        const parseContent = () : string => {
            return frontend.parseContent(options, getTokens());
        };

        const parseNavTree = () : Node[] => {
            return frontend.parseNavTree(options, navTree, getTokens());
        }

        return {
            getTokens: getTokens,
            parseMenuTree: parseMenuTree,
            parseContent: parseContent,
            parseNavTree: parseNavTree
        };
    }
}

// @Public Node[] / Tree parser
export function parseTree(options, tokens : Token[]) : Node[] {
    const tree : Node[] = [];
    tokens.forEach((token, index) => {

        // skip first healine
        if (index === 0 && options.skipFirstHeadline) { return; }

        // push to parent as child
        let ancestor : Node = tree[ tree.length-1 ];

        // push to root
        if (tree.length === 0 || token.depth <= ancestor.item.depth) {
            return tree.push(createNodeFromToken(token));
        };

        do {
            let whileCond : boolean = ancestor.children.length !== 0 && ancestor.children[ancestor.children.length - 1].item.depth < token.depth;
            if (!whileCond) { break; }
            ancestor = ancestor.children[ ancestor.children.length-1 ]
        } while (true)

        ancestor.children.push(createNodeFromToken(token));
    });

    return tree;
}

export function pushToTree(options, tree : Node[], token : Token) : Node[] {
    if (!token) return tree;
    if (tree.length < 1) {
        return [createNodeFromToken(token)];
    }
    const deeper = tree.filter(i => i.children.length > 0);
    if (deeper.length > 0) {
        tree.concat(pushToTree(options, deeper[0].children, token));
        return tree;
    }
    tree.push(createNodeFromToken(token));
    return tree;
}
