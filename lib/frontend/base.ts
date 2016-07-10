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
    getFileName() : string;
}

export interface Frontend {
    tokenize(options, raw : string) : any;
    parseContent(options, tokens : any) : string;
    parseMenuTree(options, tokens : Token[]) : Node[];
    getFileName(options, tokens : Token[]) : string;
};


export interface ParserFactory extends Function {
    (options, raw : string) : Parser
}

// @Private function for generating ids
// TODO: generate uniq values (iterator integer?)
function idFromText(text : string) : string {
    return text.toLowerCase().replace(/[^\w]+/g, '-');
}

// @Public Node basic constructor
export function createNode(text : string, href : string) : Node {
    return { item: { text: text, href: href, depth: 1 },
             children: [] };
}

// @Private Node from Token constructor
function createNodeFromToken(token : Token, href? : string) : Node {
    href = href || `#${idFromText(token.text)}`;
    return createNode(token.text, href);
}

// @Public Main constructor
export default function (frontend : Frontend) : ParserFactory {
    return (options, raw : string) : Parser => {
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

        const getFileName = () : string => {
            return frontend.getFileName(options, getTokens());
        };

        return {
            getTokens: getTokens,
            parseMenuTree: parseMenuTree,
            parseContent: parseContent,
            getFileName: getFileName
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

function findParent(tree : Node[], href : string) : Node {
    const pathArr : string[] = href.split('/');
    const parentPath : string = pathArr.slice(0, pathArr.length - 1).join('/');
    const parent = tree.filter((i) => !!i.item.href.match(parentPath));

    if (parent.length < 1) {
        return findParent(tree, parentPath);
    }
    return parent[0];
}

export function pushDepthToTree(options, tree : Node[], nodes : Node[]) : Node[] {
    if (!nodes || nodes.length == 0) return tree;
    if (tree.length < 1) {
        return nodes;
    }
    const deeper = tree.filter(i => i.children.length > 0);
    if (deeper.length > 0) {
        tree.concat(pushDepthToTree(options, deeper[0].children, nodes));
        return tree;
    }
    nodes.forEach((node) => {
        const parent = findParent(tree, node.item.href);
        parent.children.push(node);
    })
    return tree;
}
