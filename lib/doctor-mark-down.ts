import marked from './frontend/marked';
import menu from './frontend/menu';
import handlebars from './backend/handlebars';

export default function (settings, template : string) {
    const compile = handlebars(settings, template);

    return (raw : string) : string => {
        const parser = marked(settings, raw);
        const nav = menu(settings, parser.parseMenuTree());

        return compile({
            menu: nav,
            content: parser.parseContent()
        });
    };
};
