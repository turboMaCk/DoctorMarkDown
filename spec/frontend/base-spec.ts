///<reference path="../../header_files/jasmine.d.ts"/>

import { pushToTree, Token } from '../../lib/frontend/base';

export default describe('parseNavTree', () => {
    describe('flat tree', () => {
        const initialTree = [
            { item: { text: 'first', href: "", depth: 1 }, children: [] },
            { item: { text: 'second', href: "", depth: 1 }, children: [] }
        ];
        const token : Token = { text: 'third', type: "heading", depth: 1 };

        it('should push as last', () => {
            const exp = [
                { item: { text: 'first', href: "", depth: 1 }, children: [] },
                { item: { text: 'second', href: "", depth: 1 }, children: [] },
                { item: { text: 'third', href: "#third", depth: 1 }, children: [] }
            ];

            expect(pushToTree({}, initialTree, token)).toEqual(exp)
        });
    });

    describe('nested tree push deep', () => {
        const initialTree = [
            { item: { text: 'first', href: "", depth: 1 }, children: [] },
            { item: { text: 'second', href: "", depth: 1 }, children: [
                { item: { text: 'deep', href: "", depth: 1 }, children: [] },
                { item: { text: 'deep', href: "", depth: 1 }, children: [] },
                { item: { text: 'deep', href: "", depth: 1 }, children: [
                    { item: { text: 'deeper', href: "", depth: 1 }, children: [] },
                ] },
            ] },
            { item: { text: 'third', href: "", depth: 1 }, children: [] },
        ];
        const token : Token = { text: 'new', type: "heading", depth: 1 };

        it('should push as last', () => {
            const exp = [
                { item: { text: 'first', href: "", depth: 1 }, children: [] },
                { item: { text: 'second', href: "", depth: 1 }, children: [
                    { item: { text: 'deep', href: "", depth: 1 }, children: [] },
                    { item: { text: 'deep', href: "", depth: 1 }, children: [] },
                    { item: { text: 'deep', href: "", depth: 1 }, children: [
                        { item: { text: 'deeper', href: "", depth: 1 }, children: [] },
                        { item: { text: 'new' , href: '#new', depth: 1}, children: [] }
                    ] },
                ] },
                { item: { text: 'third', href: "", depth: 1 }, children: [] },
            ];

            expect(pushToTree({}, initialTree, token)).toEqual(exp)
        });
    });
});