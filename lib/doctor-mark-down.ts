import marked from './frontend/marked';
import menu, { Node } from './frontend/menu';
import handlebars from './backend/handlebars';

export interface Settings {
    skipFirstHeadline: boolean;
    files: string[];
    outputDir: string;
    depth: string;
}

export interface NavAndPath {
    navTree : Node[];
    path : string;
}

export interface Compiler {
    compile(NavAndPath) : string;
    getFileName() : string;
}

export interface CompilerFactory extends Function {
    (raw : string, assetPath? : string) : Compiler
}

export interface CompileResult {
    content : string;
    navigation : Node[];
}

export default function (settings, template : string) : CompilerFactory {
    const compile = handlebars(settings, template);

    return (raw : string, assetsPath? : string) : Compiler => {
        assetsPath = assetsPath || 'assets';
        const parser = marked(settings, raw);

        return {
            compile(navParams? : NavAndPath) : string {
                const navTree = settings.recursive && navParams ? navParams.navTree : [];
                const path = settings.recursive && navParams ? navParams.path : undefined;
                return compile({
                    menu: menu(settings, parser.parseMenuTree()),
                    content: parser.parseContent(),
                    assetsPath: assetsPath,
                    navigation: menu(settings, navTree, path)
                });
            },
            getFileName() : string {
                return parser.getFileName();
            }
        }
    };
};
