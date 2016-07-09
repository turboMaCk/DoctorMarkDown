export interface Data {
    content : string;
    menu : string;
    assetsPath : string;
    navigation : string;
};

export interface Backend extends Function {
    (data : Data) : string;
}

export interface ParserFactory extends Function {
    (settings, template : string) : Backend
}

export interface Parser extends Function {
    (settings, template : string, data : Data) : string;
}

// @Public parser factory
export default function BackendFactory(compiler : Parser) : ParserFactory {
    return (settings, template : string) : Backend => {
        return compiler.bind(this, settings, template);
    }
};
