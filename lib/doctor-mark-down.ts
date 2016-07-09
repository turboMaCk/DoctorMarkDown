import marked from './frontend/marked';
import menu, { Node } from './frontend/menu';
import handlebars from './backend/handlebars';

export interface Settings {
    skipFirstHeadline: boolean;
    files: string[];
    outputDir: string;
    depth: string;
}

export interface Compiler {
    compile() : string;
    getNavTree() : Node[];
}

export default function (settings, template : string) {
    const compile = handlebars(settings, template);

    return (raw : string, assetsPath? : string, navTree? : Node[]) : Compiler => {
        navTree = navTree || [];
        assetsPath = assetsPath || 'assets';
        const parser = marked(settings, raw, navTree);

        return {
            compile() : string {
                return compile({
                    menu: menu(settings, parser.parseMenuTree()),
                    content: parser.parseContent(),
                    assetsPath: assetsPath,
                    navigation: menu(settings, parser.parseNavTree())
                });
            },
            getNavTree() : Node[] {
                return parser.parseNavTree();
            }
        }
    };
};
