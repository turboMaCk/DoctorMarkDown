///<reference path="../../header_files/jasmine.d.ts"/>
import Browser from '../../lib/filesystem/browser';

export default describe('file browser util', () => {

    const root = './spec/mock/fs';

    describe('file system browser (tree parser)', () => {
        const settings = {
            recursive: true,
            files: ['a.md', 'b.md'],
            ignore: ['ignore']
        };

        const browser = Browser(settings);

        let error, result;
        beforeEach((done) => {
            browser(root, (err, res) => {
                error = err;
                result = res;
                done();
            });
        });

        it('do not return err', () => expect(error).toBe(null));

        describe('parse mocks correctly', () => {
            it('return correct structure', () => {
                const expected = {
                    path: `${root}`,
                    children: [
                        { path: `${root}/a.md` },
                        { path: `${root}/deep`, children: [
                            { path: `${root}/deep/a.md` },
                            { path: `${root}/deep/b.md` },
                        ] },
                        { path: `${root}/skipped/deeper`, children: [
                            { path: `${root}/skipped/deeper/a.md` }
                        ] },
                        { path: `${root}/deepskip/skipped/deepest`, children: [
                            { path: `${root}/deepskip/skipped/deepest/b.md` }
                        ] }
                    ]
                };

                expect(result.path).toEqual(root);
                expect(result.children[0].path).toEqual(`${root}/a.md`);
                expect(result.children[3].path).toEqual(`${root}/deepskip/skipped/deepest`);
                expect(result).toEqual(expected);
            });
        });
    });

    describe('flat file system browse', () => {
        const settings = {
            recursive: false,
            files: ['a.md', 'b.md'],
            ignore: ['ignore']
        };

        const browser = Browser(settings);

        let error, result;
        beforeEach((done) => {
            browser(root, (err, res) => {
                error = err;
                result = res;
                done();
            });
        });

        it('do not return err', () => expect(error).toBe(null));

        describe('parse mock flattly', () => {
            it ('return correct structure', () => {
                const expected = {
                    path: `${root}`,
                    children: [
                        { path: `${root}/a.md` }
                    ]
                };

                expect(result).toEqual(expected);
            });
        });
    });
});
