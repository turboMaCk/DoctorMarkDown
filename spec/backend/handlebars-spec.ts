///<reference path="../jasmine.d.ts"/>

import handlebars from '../../lib/backend/handlebars';

export default describe('Handlebars backend', () => {
    it('should compile data to html', () => {
        const template = '{{{menu}}}<br>{{{content}}}';
        const data = {
            menu: "MENU",
            content: "CONTENT"
        };

        const compile = handlebars({}, template);

        expect(compile(data)).toEqual('MENU<br>CONTENT');
    });
});
