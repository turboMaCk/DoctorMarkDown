///<reference path="../../header_files/jasmine.d.ts"/>

import generateMenu from '../../lib/frontend/menu';

export default describe('menu html generator', () => {
    it('should generate flat menu', () => {
        const tree = [
            { item: { text: 'first', href: '#first' }, children: [] },
            { item: { text: 'second', href: '#second' }, children: [] },
            { item: { text: 'third', href: '#third' }, children: [] },
        ];

        const html = '<ul>\n' +
            '<li><a href="#first">first</a>\n</li>\n\n' +
            '<li><a href="#second">second</a>\n</li>\n\n' +
            '<li><a href="#third">third</a>\n</li>\n' +
            '</ul>';

        expect(generateMenu({}, tree)).toEqual(html);
    });

    it('should generate newsted menu', () => {
        const tree = [
            { item: { text: 'first', href: '#first' }, children: [
                { item: { text: 'second', href: '#second' }, children: [] },
                { item: { text: 'third', href: '#third' }, children: [] },
            ] },
        ];

        const html = '<ul>\n' +
            '<li><a href="#first">first</a>\n' +
            '<ul>\n' +
            '<li><a href="#second">second</a>\n</li>\n\n' +
            '<li><a href="#third">third</a>\n</li>\n' +
            '</ul></li>\n' +
            '</ul>';

        expect(generateMenu({}, tree)).toEqual(html);
    });
});
