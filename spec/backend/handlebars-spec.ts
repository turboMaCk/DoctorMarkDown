///<reference path="../../header_files/jasmine.d.ts"/>

import handlebars from '../../lib/backend/handlebars';

export default describe('Handlebars backend', () => {
    it('should compile data to html', () => {
        const template = '{{{menu}}}<br>{{{content}}}';
        const data = {
            menu: "MENU",
            content: "CONTENT",
            navigation: '',
            assetsPath: ''
        };

        const compile = handlebars({}, template);

        expect(compile(data)).toEqual('MENU<br>CONTENT');
    });
});
