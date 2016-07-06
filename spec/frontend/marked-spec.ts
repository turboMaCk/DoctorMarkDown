///<reference path="../../header_files/jasmine.d.ts"/>

import marked from '../../lib/frontend/marked';
import getMock from '../helpers/get-mock';
import { defaultSettings } from '../../lib/bin/docmd';

export default describe('marked frontend', () => {
    describe('no options', function() {

        it('can parse content', () => {
            const raw = 'I am using __markdown__.';
            const subject = marked(defaultSettings, raw);
            const html = '<p>I am using <strong>markdown</strong>.</p>\n'
            expect(subject.parseContent()).toEqual(html);
            expect(subject.parseMenuTree()).toEqual([]);
        });

        it('can parse tree', () => {
            const raw = getMock('s.md');
            const subject = marked(defaultSettings, raw);
            const html = '<h1 id="main">Main</h1>\n' +
                '<p>Intro</p>\n' +
                '<h2 id="first">First</h2>\n' +
                '<p>text</p>\n' +
                '<h2 id="second">Second</h2>\n' +
                '<p>text</p>\n' +
                '<h3 id="sub">Sub</h3>\n' +
                '<h3 id="sub">Sub</h3>\n' +
                '<h4 id="subsub">SubSub</h4>\n' +
                '<h3 id="sub">Sub</h3>\n' +
                '<h1 id="third">Third</h1>\n';
            const menuTree = [
                { item: { text: 'Main', href: '#main', depth: 1 },
                  children: [
                    { item: { text: 'First', href: '#first', depth: 2 },
                    children: [] },
                    { item: { text: 'Second', href: '#second', depth: 2 },
                    children: [
                        { item: { text: 'Sub', href: '#sub', depth: 3 },
                            children: [] },
                        { item: { text: 'Sub', href: '#sub', depth: 3 },
                            children: [
                                { item: { text: 'SubSub', href: '#subsub', depth: 4 },
                                children: [] }
                            ] },
                        { item: { text: 'Sub', href: '#sub', depth: 3 },
                            children: [] },
                    ]},
                  ] },
                { item: { text: 'Third', href: '#third', depth: 1 },
                  children: [] }
            ];

            expect(subject.parseContent()).toEqual(html);
            expect(subject.parseMenuTree()).toEqual(menuTree);
        });
    });

    describe('options: skip first headline', () => {
        const options = { skipFirstHeadline: true, depth: '6' };

        it('can parse tree', () => {
            const raw = getMock('s.md');
            const subject = marked(options, raw);
            const menuTree = [
                { item: { text: 'First', href: '#first', depth: 2 },
                  children: [] },
                { item: { text: 'Second', href: '#second', depth: 2 },
                  children: [
                      { item: { text: 'Sub', href: '#sub', depth: 3 },
                        children: [] },
                      { item: { text: 'Sub', href: '#sub', depth: 3 },
                        children: [
                            { item: { text: 'SubSub', href: '#subsub', depth: 4 },
                              children: [] }
                        ] },
                      { item: { text: 'Sub', href: '#sub', depth: 3 },
                        children: [] },
                  ]},
                { item: { text: 'Third', href: '#third', depth: 1 },
                  children: [] }
            ];

            expect(subject.parseMenuTree()).toEqual(menuTree);
        });
    });

    describe('options: depth', () => {
        const options = { depth: '2' };

        it('can parse tree', () => {
            const raw = getMock('s.md');
            const subject = marked(options, raw);
            const menuTree = [
                { item: { text: 'Main', href: '#main', depth: 1 },
                  children: [
                    { item: { text: 'First', href: '#first', depth: 2 },
                    children: [] },
                    { item: { text: 'Second', href: '#second', depth: 2 },
                    children: [] },
                  ]},
                { item: { text: 'Third', href: '#third', depth: 1 },
                  children: [] }
            ];

            expect(subject.parseMenuTree()).toEqual(menuTree);
        });
    });

    it('get file name', () => {
        const raw = getMock('s.md');
        const subject = marked({}, raw);

        expect(subject.getFileName()).toEqual('Main');
    })
});
