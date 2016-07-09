export interface NodeItem {
    text : string;
    href : string;
    depth? : number;
}

export interface Node {
    item : NodeItem;
    children : Node[];
}

// TODO:
// This is just initial basic implementation. Consider following improvements:
//     - Use tail recursion for better performance
//     - Add escaping to prevent XSS
//     - Add path to params and check is active && active parent classes
export default function generateMenu(setting, tree : Node[]) : string {
    const items : string[] = tree.map((node) => {
        let parsedChildren : string = '';

        if (node.children.length > 0) {
            parsedChildren = generateMenu(setting, node.children);
        }

        return `<li><a href="${node.item.href}">${node.item.text}</a>\n${parsedChildren}</li>\n`;
    });

    return `<ul>\n${items.join('\n')}</ul>`;
}
