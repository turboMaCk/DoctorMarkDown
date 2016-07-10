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
    getFileName() : string;
    compileWithNav(tree : Node[]) : CompileResult;
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
            compile() : string {
                return compile({
                    menu: menu(settings, parser.parseMenuTree()),
                    content: parser.parseContent(),
                    assetsPath: assetsPath,
                    navigation: ''
                });
            },
            getFileName() : string {
                return parser.getFileName();
            },
            compileWithNav(navTree : Node[]) : CompileResult {
                return {
                    content: compile({
                        menu: menu(settings, parser.parseMenuTree()),
                        content: parser.parseContent(),
                        assetsPath: assetsPath,
                        navigation: menu(settings, navTree)
                    }),
                    navigation: navTree
                }
            }
        }
    };
};
