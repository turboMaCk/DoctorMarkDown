export interface NodeItem {
    text : string;
    href : string;
    depth? : number;
}

export interface Node {
    item : NodeItem;
    children : Node[];
}

function diffPath(reference : string, path : string) : { add : string[], miss: string[] } {
    const refArr : string[] = reference.split('/').filter(i => i != 'index.html');
    const pathArr : string[] = path.split('/').filter(i => i != 'index.html');
    let add : string[] = [];
    let miss : string[] = [];

    refArr.forEach((part : string, i : number) => {
        const inPath = pathArr[i];
        if (!inPath && !!part) {
            miss.push(part);
        } else if (part !== inPath)  {
            miss.push(part);
            add.push(inPath);
        }
    });

    add = add.concat(pathArr.slice(refArr.length));

    return { add, miss };
}

function resolveHref(setting, nodeHref : string, path? : string) : string {
    if (!path) return nodeHref;

    const diff = diffPath(path, nodeHref);
    let str : string = '';
    diff.miss.forEach(_ => str += '../');
    diff.add.forEach(path => str += `${path}/`);
    str += 'index.html';
    return str;
}

// TODO:
// This is just initial basic implementation. Consider following improvements:
//     - Use tail recursion for better performance
//     - Add escaping to prevent XSS
//     - Add path to params and check is active && active parent classes
export default function generateMenu(setting, tree : Node[], path? : string) : string {
    if (tree.length < 1) return '';

    const items : string[] = tree.map((node) => {
        let parsedChildren : string = '';

        if (node.children.length > 0) {
            parsedChildren = generateMenu(setting, node.children, path);
        }

        const href = resolveHref(setting, node.item.href, path);
        return `<li><a href="${href}">${node.item.text}</a>\n${parsedChildren}</li>\n`;
    });

    return `<ul>\n${items.join('\n')}</ul>`;
}
