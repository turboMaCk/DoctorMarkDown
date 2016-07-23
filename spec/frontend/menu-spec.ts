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

    it('should resolve relative paths', () => {
        const tree = [
            { item: { text: 'first', href: '/documentation/index.html' }, children: [
                { item: { text: 'second', href: '/documentation/nested/index.html' }, children: [] },
                { item: { text: 'third', href: '/documentation/other/index.html' }, children: [] },
            ] },
        ];
        const path = '/documentation/nested/index.html';

        const html = '<ul>\n' +
            '<li><a href="../index.html">first</a>\n' +
            '<ul>\n' +
            '<li><a href="index.html">second</a>\n</li>\n\n' +
            '<li><a href="../other/index.html">third</a>\n</li>\n' +
            '</ul></li>\n' +
            '</ul>';

        expect(generateMenu({}, tree, path)).toEqual(html);
    });
});
