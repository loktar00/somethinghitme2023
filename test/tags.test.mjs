import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import { JSDOM } from 'jsdom';

import { processArticleTags, generateTagSlug, buildTagIndex } from '../index.mjs';

// =============================================================================
// MOCK DATA HELPERS
// =============================================================================

const createMockArticle = (overrides = {}) => ({
    title: 'Test Article',
    date: '2024-01-01',
    path: 'test-article',
    teaser: 'Test teaser',
    tags: 'javascript, testing',
    tagList: ['javascript', 'testing'],
    tagSlugs: ['javascript', 'testing'],
    ...overrides
});

const createMockSiteData = (overrides = {}) => ({
    author: { name: 'Test Author', handle: 'test' },
    main: { title: 'Test Site' },
    projects: [],
    ...overrides
});

// Mock file system for EJS includes during testing
const createMockFileSystem = () => {
    const mockFiles = {
        '/src/templates/partials/head.ejs': `<head><title><%= title %></title></head>`,
        '/src/templates/partials/header.ejs': `<header><nav></nav></header>`,
        '/src/templates/partials/footer.ejs': `<footer></footer>`,
        '/src/templates/partials/social.ejs': `<section class="social"></section>`,
        '/src/templates/partials/projects.ejs': `<section class="projects"></section>`,
        '/src/templates/partials/navigation.ejs': `<nav class="navigation"></nav>`
    };

    const originalFileLoader = ejs.fileLoader;
    ejs.fileLoader = (filePath) => {
        const mockKey = filePath.replace(/\\/g, '/').replace(process.cwd().replace(/\\/g, '/') + '/', '/');
        if (mockFiles[mockKey]) {
            return mockFiles[mockKey];
        }
        try {
            return fs.readFileSync(filePath, 'utf8');
        } catch {
            return `<!-- Mock: ${filePath} -->`;
        }
    };

    return () => {
        ejs.fileLoader = originalFileLoader;
    };
};

// =============================================================================
// SECTION A: processArticleTags() Tests
// =============================================================================

describe('processArticleTags()', () => {
    it('should parse comma-separated tags into tagList and tagSlugs', () => {
        const result = processArticleTags('javascript, node.js, testing');
        assert.deepEqual(result.tagList, ['javascript', 'node.js', 'testing']);
        assert.deepEqual(result.tagSlugs, ['javascript', 'nodejs', 'testing']);
    });

    it('should handle single tag', () => {
        const result = processArticleTags('javascript');
        assert.deepEqual(result.tagList, ['javascript']);
        assert.deepEqual(result.tagSlugs, ['javascript']);
    });

    it('should trim whitespace from each tag', () => {
        const result = processArticleTags('  javascript  ,   node.js  ,  testing  ');
        assert.deepEqual(result.tagList, ['javascript', 'node.js', 'testing']);
    });

    it('should filter out empty tags', () => {
        const result = processArticleTags('javascript,,,node.js,');
        assert.deepEqual(result.tagList, ['javascript', 'node.js']);
        assert.deepEqual(result.tagSlugs, ['javascript', 'nodejs']);
    });

    it('should return empty arrays for null input', () => {
        const result = processArticleTags(null);
        assert.deepEqual(result, { tagList: [], tagSlugs: [] });
    });

    it('should return empty arrays for undefined input', () => {
        const result = processArticleTags(undefined);
        assert.deepEqual(result, { tagList: [], tagSlugs: [] });
    });

    it('should return empty arrays for empty string', () => {
        const result = processArticleTags('');
        assert.deepEqual(result, { tagList: [], tagSlugs: [] });
    });

    it('should return empty arrays for whitespace-only string', () => {
        const result = processArticleTags('   ');
        assert.deepEqual(result, { tagList: [], tagSlugs: [] });
    });

    it('should return empty arrays for non-string input', () => {
        const result = processArticleTags(123);
        assert.deepEqual(result, { tagList: [], tagSlugs: [] });
    });

    it('should preserve case in tagList', () => {
        const result = processArticleTags('JavaScript, NODE.JS, Testing');
        assert.deepEqual(result.tagList, ['JavaScript', 'NODE.JS', 'Testing']);
    });

    it('should handle tags with hyphens', () => {
        const result = processArticleTags('web-development, full-stack');
        assert.deepEqual(result.tagList, ['web-development', 'full-stack']);
        assert.deepEqual(result.tagSlugs, ['web-development', 'full-stack']);
    });

    it('should handle tags with dots', () => {
        const result = processArticleTags('node.js, typescript.js');
        assert.deepEqual(result.tagList, ['node.js', 'typescript.js']);
        assert.deepEqual(result.tagSlugs, ['nodejs', 'typescriptjs']);
    });

    it('should handle tags with multiple spaces between commas', () => {
        const result = processArticleTags('javascript    ,    node.js    ,    testing');
        assert.deepEqual(result.tagList, ['javascript', 'node.js', 'testing']);
    });

    it('should maintain tagList and tagSlugs array length consistency', () => {
        const result = processArticleTags('a, b, c, d, e');
        assert.equal(result.tagList.length, result.tagSlugs.length);
        assert.equal(result.tagList.length, 5);
    });

    it('should handle special characters in tags', () => {
        const result = processArticleTags('C++, C#, F#');
        // C++ becomes 'c', C# becomes 'c', F# becomes 'f'
        assert.deepEqual(result.tagList, ['C++', 'C#', 'F#']);
        // Exact slugs depend on implementation
        assert(result.tagSlugs.length === 3);
    });
});

// =============================================================================
// SECTION B: generateTagSlug() Tests
// =============================================================================

describe('generateTagSlug()', () => {
    it('should convert to lowercase', () => {
        assert.equal(generateTagSlug('JavaScript'), 'javascript');
        assert.equal(generateTagSlug('NODE.JS'), 'nodejs');
    });

    it('should convert spaces to hyphens', () => {
        assert.equal(generateTagSlug('web development'), 'web-development');
    });

    it('should remove dots', () => {
        assert.equal(generateTagSlug('node.js'), 'nodejs');
        assert.equal(generateTagSlug('typescript.js'), 'typescriptjs');
    });

    it('should handle multiple dots', () => {
        assert.equal(generateTagSlug('a.b.c'), 'abc');
    });

    it('should remove leading and trailing hyphens', () => {
        assert.equal(generateTagSlug('---test---'), 'test');
        assert.equal(generateTagSlug('-test'), 'test');
        assert.equal(generateTagSlug('test-'), 'test');
    });

    it('should collapse multiple consecutive hyphens', () => {
        assert.equal(generateTagSlug('test---tag'), 'test-tag');
        assert.equal(generateTagSlug('web----development'), 'web-development');
    });

    it('should convert special characters to hyphens', () => {
        assert.equal(generateTagSlug('test@tag'), 'test-tag');
        assert.equal(generateTagSlug('test!tag'), 'test-tag');
    });

    it('should handle C++ correctly', () => {
        const slug = generateTagSlug('C++');
        assert.equal(slug, 'c');
    });

    it('should handle C# correctly', () => {
        const slug = generateTagSlug('C#');
        assert.equal(slug, 'c');
    });

    it('should handle F# correctly', () => {
        const slug = generateTagSlug('F#');
        assert.equal(slug, 'f');
    });

    it('should trim whitespace', () => {
        assert.equal(generateTagSlug('  javascript  '), 'javascript');
    });

    it('should handle empty string', () => {
        assert.equal(generateTagSlug(''), '');
    });

    it('should handle string with only special characters', () => {
        assert.equal(generateTagSlug('###'), '');
    });

    it('should handle mixed case with special characters', () => {
        assert.equal(generateTagSlug('Web-Development'), 'web-development');
    });

    it('should handle hyphens with spaces', () => {
        assert.equal(generateTagSlug('web - development'), 'web-development');
    });

    it('should handle already-slug-like input', () => {
        assert.equal(generateTagSlug('web-development'), 'web-development');
    });

    it('should handle numbers', () => {
        assert.equal(generateTagSlug('es2024'), 'es2024');
        assert.equal(generateTagSlug('React 18'), 'react-18');
    });

    it('should handle unicode characters', () => {
        // Should remove non-ASCII characters
        const slug = generateTagSlug('café');
        assert(slug.length > 0);
    });
});

// =============================================================================
// SECTION C: buildTagIndex() Tests
// =============================================================================

describe('buildTagIndex()', () => {
    it('should create tag index with correct structure', () => {
        const articles = [
            createMockArticle({ tagList: ['javascript'], tagSlugs: ['javascript'] })
        ];
        const tagIndex = buildTagIndex(articles);

        assert(tagIndex.javascript);
        assert.equal(tagIndex.javascript.name, 'javascript');
        assert.equal(tagIndex.javascript.slug, 'javascript');
        assert.equal(tagIndex.javascript.count, 1);
        assert(Array.isArray(tagIndex.javascript.articles));
    });

    it('should count articles per tag correctly', () => {
        const articles = [
            createMockArticle({ tagList: ['javascript'], tagSlugs: ['javascript'] }),
            createMockArticle({ tagList: ['javascript'], tagSlugs: ['javascript'] }),
            createMockArticle({ tagList: ['testing'], tagSlugs: ['testing'] })
        ];
        const tagIndex = buildTagIndex(articles);

        assert.equal(tagIndex.javascript.count, 2);
        assert.equal(tagIndex.testing.count, 1);
    });

    it('should include complete article metadata in tag index', () => {
        const articles = [
            createMockArticle({
                title: 'JS Article',
                date: '2024-01-01',
                path: 'js-article',
                teaser: 'About JavaScript',
                tags: 'javascript',
                tagList: ['javascript'],
                tagSlugs: ['javascript']
            })
        ];
        const tagIndex = buildTagIndex(articles);
        const article = tagIndex.javascript.articles[0];

        assert.equal(article.title, 'JS Article');
        assert.equal(article.date, '2024-01-01');
        assert.equal(article.path, 'js-article');
        assert.equal(article.teaser, 'About JavaScript');
    });

    it('should handle articles with no tags', () => {
        const articles = [
            createMockArticle({ tagList: [], tagSlugs: [] }),
            createMockArticle({ tagList: ['javascript'], tagSlugs: ['javascript'] })
        ];
        const tagIndex = buildTagIndex(articles);

        assert(!tagIndex['']); // No empty tag
        assert.equal(tagIndex.javascript.count, 1);
    });

    it('should handle empty article array', () => {
        const tagIndex = buildTagIndex([]);
        assert.deepEqual(tagIndex, {});
    });

    it('should handle articles with multiple tags', () => {
        const articles = [
            createMockArticle({
                tagList: ['javascript', 'node.js', 'testing'],
                tagSlugs: ['javascript', 'nodejs', 'testing']
            })
        ];
        const tagIndex = buildTagIndex(articles);

        assert.equal(Object.keys(tagIndex).length, 3);
        assert.equal(tagIndex.javascript.count, 1);
        assert.equal(tagIndex.nodejs.count, 1);
        assert.equal(tagIndex.testing.count, 1);
    });

    it('should preserve case in tag names (first occurrence)', () => {
        const articles = [
            createMockArticle({
                tagList: ['JavaScript'],
                tagSlugs: ['javascript']
            })
        ];
        const tagIndex = buildTagIndex(articles);

        assert.equal(tagIndex.javascript.name, 'JavaScript');
    });

    it('should add articles in order', () => {
        const articles = [
            createMockArticle({ title: 'First', tagList: ['javascript'], tagSlugs: ['javascript'] }),
            createMockArticle({ title: 'Second', tagList: ['javascript'], tagSlugs: ['javascript'] })
        ];
        const tagIndex = buildTagIndex(articles);

        assert.equal(tagIndex.javascript.articles[0].title, 'First');
        assert.equal(tagIndex.javascript.articles[1].title, 'Second');
    });

    it('should handle tag count and articles array consistency', () => {
        const articles = [
            createMockArticle({ title: 'A', tagList: ['tag1'], tagSlugs: ['tag1'] }),
            createMockArticle({ title: 'B', tagList: ['tag1'], tagSlugs: ['tag1'] }),
            createMockArticle({ title: 'C', tagList: ['tag1'], tagSlugs: ['tag1'] })
        ];
        const tagIndex = buildTagIndex(articles);

        assert.equal(tagIndex.tag1.count, 3);
        assert.equal(tagIndex.tag1.articles.length, 3);
    });

    it('should maintain article metadata in tag index', () => {
        const articles = [
            createMockArticle({
                title: 'Test',
                tags: 'javascript, testing',
                tagList: ['javascript', 'testing'],
                tagSlugs: ['javascript', 'testing']
            })
        ];
        const tagIndex = buildTagIndex(articles);
        const article = tagIndex.javascript.articles[0];

        assert.equal(article.tags, 'javascript, testing');
        assert.deepEqual(article.tagList, ['javascript', 'testing']);
        assert.deepEqual(article.tagSlugs, ['javascript', 'testing']);
    });

    it('should handle overlapping tags across articles', () => {
        const articles = [
            createMockArticle({ title: 'Article 1', tagList: ['javascript', 'web'], tagSlugs: ['javascript', 'web'] }),
            createMockArticle({ title: 'Article 2', tagList: ['javascript', 'node'], tagSlugs: ['javascript', 'node'] })
        ];
        const tagIndex = buildTagIndex(articles);

        assert.equal(tagIndex.javascript.count, 2);
        assert.equal(tagIndex.javascript.articles.length, 2);
        assert.equal(tagIndex.web.count, 1);
        assert.equal(tagIndex.node.count, 1);
    });
});

// =============================================================================
// SECTION D: Tag Cloud Template Tests
// =============================================================================

describe('Tag Cloud Template', () => {
    it('should render tag cloud section with correct structure', () => {
        const restoreMock = createMockFileSystem();

        try {
            const tagIndex = {
                javascript: { name: 'JavaScript', slug: 'javascript', count: 10 },
                testing: { name: 'Testing', slug: 'testing', count: 5 }
            };

            const template = fs.readFileSync('./src/templates/partials/tagcloud.ejs', 'utf8');
            const html = ejs.render(template, { data: { tagIndex } });
            const dom = new JSDOM(html);
            const doc = dom.window.document;

            const section = doc.querySelector('.tag-cloud-section');
            assert(section, 'tag-cloud-section element should exist');

            const cloudDiv = doc.querySelector('.tag-cloud');
            assert(cloudDiv, 'tag-cloud div should exist');
        } finally {
            restoreMock();
        }
    });

    it('should render tag links with correct href', () => {
        const restoreMock = createMockFileSystem();

        try {
            const tagIndex = {
                javascript: { name: 'JavaScript', slug: 'javascript', count: 5 }
            };

            const template = fs.readFileSync('./src/templates/partials/tagcloud.ejs', 'utf8');
            const html = ejs.render(template, { data: { tagIndex } });
            const dom = new JSDOM(html);
            const doc = dom.window.document;

            const link = doc.querySelector('.tag-cloud-tag');
            assert.equal(link.getAttribute('href'), '/tags/javascript.html');
        } finally {
            restoreMock();
        }
    });

    it('should render all tags', () => {
        const restoreMock = createMockFileSystem();

        try {
            const tagIndex = {
                javascript: { name: 'JavaScript', slug: 'javascript', count: 10 },
                testing: { name: 'Testing', slug: 'testing', count: 5 },
                nodejs: { name: 'Node.js', slug: 'nodejs', count: 3 }
            };

            const template = fs.readFileSync('./src/templates/partials/tagcloud.ejs', 'utf8');
            const html = ejs.render(template, { data: { tagIndex } });
            const dom = new JSDOM(html);
            const doc = dom.window.document;

            const tags = doc.querySelectorAll('.tag-cloud-tag');
            assert.equal(tags.length, 3);
        } finally {
            restoreMock();
        }
    });

    it('should apply font-size styles in rem units', () => {
        const restoreMock = createMockFileSystem();

        try {
            const tagIndex = {
                javascript: { name: 'JavaScript', slug: 'javascript', count: 10 }
            };

            const template = fs.readFileSync('./src/templates/partials/tagcloud.ejs', 'utf8');
            const html = ejs.render(template, { data: { tagIndex } });

            assert(html.includes('font-size:'), 'Should have font-size style');
            assert(html.includes('rem'), 'Should have rem units');
        } finally {
            restoreMock();
        }
    });

    it('should calculate size between 0.75rem and 1.5rem', () => {
        const restoreMock = createMockFileSystem();

        try {
            const tagIndex = {
                small: { name: 'Small', slug: 'small', count: 1 },
                large: { name: 'Large', slug: 'large', count: 100 }
            };

            const template = fs.readFileSync('./src/templates/partials/tagcloud.ejs', 'utf8');
            const html = ejs.render(template, { data: { tagIndex } });
            const dom = new JSDOM(html);
            const doc = dom.window.document;

            const tags = doc.querySelectorAll('.tag-cloud-tag');
            tags.forEach(tag => {
                const style = tag.getAttribute('style');
                const match = style.match(/font-size: ([\d.]+)rem/);
                const size = parseFloat(match[1]);
                assert(size >= 0.75 && size <= 1.5, `Size ${size} should be between 0.75 and 1.5`);
            });
        } finally {
            restoreMock();
        }
    });

    it('should use average size when all tags have same count', () => {
        const restoreMock = createMockFileSystem();

        try {
            const tagIndex = {
                tag1: { name: 'Tag 1', slug: 'tag1', count: 5 },
                tag2: { name: 'Tag 2', slug: 'tag2', count: 5 },
                tag3: { name: 'Tag 3', slug: 'tag3', count: 5 }
            };

            const template = fs.readFileSync('./src/templates/partials/tagcloud.ejs', 'utf8');
            const html = ejs.render(template, { data: { tagIndex } });
            const dom = new JSDOM(html);
            const doc = dom.window.document;

            const tags = doc.querySelectorAll('.tag-cloud-tag');
            // All should have same size (average): (0.75 + 1.5) / 2 = 1.125 (with small tolerance for floating point)
            tags.forEach(tag => {
                const style = tag.getAttribute('style');
                const match = style.match(/font-size: ([\d.]+)rem/);
                const size = parseFloat(match[1]);
                assert(Math.abs(size - 1.125) < 0.01, `Size ${size} should be approximately 1.125`);
            });
        } finally {
            restoreMock();
        }
    });

    it('should handle empty tag index', () => {
        const restoreMock = createMockFileSystem();

        try {
            const tagIndex = {};
            const template = fs.readFileSync('./src/templates/partials/tagcloud.ejs', 'utf8');
            const html = ejs.render(template, { data: { tagIndex } });

            const dom = new JSDOM(html);
            const doc = dom.window.document;
            const section = doc.querySelector('.tag-cloud-section');

            assert(section, 'Section should still render');
            const tags = doc.querySelectorAll('.tag-cloud-tag');
            assert.equal(tags.length, 0);
        } finally {
            restoreMock();
        }
    });
});

// =============================================================================
// SECTION E: Tag Page Template Tests
// =============================================================================

describe('Tag Page Template', () => {
    it('should render tag name in page title', () => {
        const restoreMock = createMockFileSystem();

        try {
            const siteData = createMockSiteData();
            const tag = { name: 'JavaScript', slug: 'javascript', count: 5, articles: [] };

            const template = fs.readFileSync('./src/templates/tag.ejs', 'utf8');
            const html = ejs.render(template, {
                data: {
                    ...siteData,
                    tag,
                    articles: [],
                    currentPage: 1,
                    totalPages: 1
                }
            });

            assert(html.includes('JavaScript'), 'Tag name should appear in page');
        } finally {
            restoreMock();
        }
    });

    it('should display article count with singular article', () => {
        const restoreMock = createMockFileSystem();

        try {
            const siteData = createMockSiteData();
            const tag = { name: 'JavaScript', slug: 'javascript', count: 1, articles: [createMockArticle()] };

            const template = fs.readFileSync('./src/templates/tag.ejs', 'utf8');
            const html = ejs.render(template, {
                data: {
                    ...siteData,
                    tag,
                    articles: [createMockArticle()],
                    currentPage: 1,
                    totalPages: 1
                }
            });

            assert(html.includes('1 article'), 'Should say "1 article" for singular');
        } finally {
            restoreMock();
        }
    });

    it('should display article count with multiple articles', () => {
        const restoreMock = createMockFileSystem();

        try {
            const siteData = createMockSiteData();
            const articles = [createMockArticle(), createMockArticle()];
            const tag = { name: 'JavaScript', slug: 'javascript', count: 2, articles };

            const template = fs.readFileSync('./src/templates/tag.ejs', 'utf8');
            const html = ejs.render(template, {
                data: {
                    ...siteData,
                    tag,
                    articles,
                    currentPage: 1,
                    totalPages: 1
                }
            });

            assert(html.includes('2 articles'), 'Should say "2 articles" for plural');
        } finally {
            restoreMock();
        }
    });

    it('should hide pagination when totalPages === 1', () => {
        const restoreMock = createMockFileSystem();

        try {
            const siteData = createMockSiteData();
            const tag = { name: 'JavaScript', slug: 'javascript', count: 2, articles: [createMockArticle()] };

            const template = fs.readFileSync('./src/templates/tag.ejs', 'utf8');
            const html = ejs.render(template, {
                data: {
                    ...siteData,
                    tag,
                    articles: [createMockArticle()],
                    currentPage: 1,
                    totalPages: 1
                }
            });

            const dom = new JSDOM(html);
            const doc = dom.window.document;
            const pagination = doc.querySelector('.pagination');

            assert(!pagination, 'Pagination should not exist when totalPages === 1');
        } finally {
            restoreMock();
        }
    });

    it('should show pagination when totalPages > 1', () => {
        const restoreMock = createMockFileSystem();

        try {
            const siteData = createMockSiteData();
            const articles = Array(15).fill(null).map((_, i) => createMockArticle({ title: `Article ${i}` }));
            const tag = { name: 'JavaScript', slug: 'javascript', count: 15, articles };

            const template = fs.readFileSync('./src/templates/tag.ejs', 'utf8');
            const html = ejs.render(template, {
                data: {
                    ...siteData,
                    tag,
                    articles: articles.slice(0, 10),
                    currentPage: 1,
                    totalPages: 2
                }
            });

            const dom = new JSDOM(html);
            const doc = dom.window.document;
            const pagination = doc.querySelector('.pagination');

            assert(pagination, 'Pagination should exist when totalPages > 1');
        } finally {
            restoreMock();
        }
    });

    it('should disable Previous button on first page', () => {
        const restoreMock = createMockFileSystem();

        try {
            const siteData = createMockSiteData();
            const articles = Array(15).fill(null).map((_, i) => createMockArticle({ title: `Article ${i}` }));
            const tag = { name: 'JavaScript', slug: 'javascript', count: 15, articles };

            const template = fs.readFileSync('./src/templates/tag.ejs', 'utf8');
            const html = ejs.render(template, {
                data: {
                    ...siteData,
                    tag,
                    articles: articles.slice(0, 10),
                    currentPage: 1,
                    totalPages: 2
                }
            });

            assert(html.includes('Previous</span>'), 'Previous button should be disabled on first page');
            assert(html.includes('class="page-link disabled"'), 'Should have disabled class');
        } finally {
            restoreMock();
        }
    });

    it('should have correct Previous link on page 2', () => {
        const restoreMock = createMockFileSystem();

        try {
            const siteData = createMockSiteData();
            const articles = Array(15).fill(null).map((_, i) => createMockArticle({ title: `Article ${i}` }));
            const tag = { name: 'JavaScript', slug: 'javascript', count: 15, articles };

            const template = fs.readFileSync('./src/templates/tag.ejs', 'utf8');
            const html = ejs.render(template, {
                data: {
                    ...siteData,
                    tag,
                    articles: articles.slice(10, 15),
                    currentPage: 2,
                    totalPages: 2
                }
            });

            // Page 2 Previous should link to /tags/javascript.html (not -page-1)
            assert(html.includes('/tags/javascript.html'), 'Previous link on page 2 should point to page 1');
        } finally {
            restoreMock();
        }
    });

    it('should have correct Previous link on page 3+', () => {
        const restoreMock = createMockFileSystem();

        try {
            const siteData = createMockSiteData();
            const articles = Array(30).fill(null).map((_, i) => createMockArticle({ title: `Article ${i}` }));
            const tag = { name: 'JavaScript', slug: 'javascript', count: 30, articles };

            const template = fs.readFileSync('./src/templates/tag.ejs', 'utf8');
            const html = ejs.render(template, {
                data: {
                    ...siteData,
                    tag,
                    articles: articles.slice(20, 30),
                    currentPage: 3,
                    totalPages: 3
                }
            });

            // Page 3 Previous should link to /tags/javascript-page-2.html
            assert(html.includes('/tags/javascript-page-2.html'), 'Previous link on page 3 should point to page 2');
        } finally {
            restoreMock();
        }
    });

    it('should have correct Next link', () => {
        const restoreMock = createMockFileSystem();

        try {
            const siteData = createMockSiteData();
            const articles = Array(15).fill(null).map((_, i) => createMockArticle({ title: `Article ${i}` }));
            const tag = { name: 'JavaScript', slug: 'javascript', count: 15, articles };

            const template = fs.readFileSync('./src/templates/tag.ejs', 'utf8');
            const html = ejs.render(template, {
                data: {
                    ...siteData,
                    tag,
                    articles: articles.slice(0, 10),
                    currentPage: 1,
                    totalPages: 2
                }
            });

            assert(html.includes('/tags/javascript-page-2.html'), 'Next link should point to page 2');
        } finally {
            restoreMock();
        }
    });

    it('should disable Next button on last page', () => {
        const restoreMock = createMockFileSystem();

        try {
            const siteData = createMockSiteData();
            const articles = Array(15).fill(null).map((_, i) => createMockArticle({ title: `Article ${i}` }));
            const tag = { name: 'JavaScript', slug: 'javascript', count: 15, articles };

            const template = fs.readFileSync('./src/templates/tag.ejs', 'utf8');
            const html = ejs.render(template, {
                data: {
                    ...siteData,
                    tag,
                    articles: articles.slice(10, 15),
                    currentPage: 2,
                    totalPages: 2
                }
            });

            assert(html.includes('Next</span>'), 'Next button should be disabled on last page');
        } finally {
            restoreMock();
        }
    });

    it('should render article cards with tags', () => {
        const restoreMock = createMockFileSystem();

        try {
            const siteData = createMockSiteData();
            const articles = [
                createMockArticle({
                    title: 'Test Article',
                    tagList: ['javascript', 'testing'],
                    tagSlugs: ['javascript', 'testing']
                })
            ];
            const tag = { name: 'JavaScript', slug: 'javascript', count: 1, articles };

            const template = fs.readFileSync('./src/templates/tag.ejs', 'utf8');
            const html = ejs.render(template, {
                data: {
                    ...siteData,
                    tag,
                    articles,
                    currentPage: 1,
                    totalPages: 1
                }
            });

            const dom = new JSDOM(html);
            const doc = dom.window.document;
            const tagLinks = doc.querySelectorAll('.article-tag');

            assert(tagLinks.length > 0, 'Should have article tags');
            const hrefs = Array.from(tagLinks).map(a => a.getAttribute('href'));
            assert(hrefs.some(href => href.includes('/tags/javascript.html')), 'Should have JavaScript tag link');
        } finally {
            restoreMock();
        }
    });
});

// =============================================================================
// SECTION F: Integration Tests
// =============================================================================

describe('Integration Tests', () => {
    it('should process tags end-to-end', () => {
        const tagsString = 'javascript, node.js, testing';
        const { tagList, tagSlugs } = processArticleTags(tagsString);

        assert.deepEqual(tagList, ['javascript', 'node.js', 'testing']);
        assert.deepEqual(tagSlugs, ['javascript', 'nodejs', 'testing']);
    });

    it('should build tag index from processed articles', () => {
        const articles = [
            createMockArticle({
                title: 'Article 1',
                tagList: ['javascript', 'web'],
                tagSlugs: ['javascript', 'web']
            }),
            createMockArticle({
                title: 'Article 2',
                tagList: ['javascript', 'node.js'],
                tagSlugs: ['javascript', 'nodejs']
            })
        ];

        const tagIndex = buildTagIndex(articles);

        assert.equal(Object.keys(tagIndex).length, 3);
        assert.equal(tagIndex.javascript.count, 2);
        assert.equal(tagIndex.web.count, 1);
        assert.equal(tagIndex.nodejs.count, 1);
    });

    it('should handle case-insensitive tag deduplication', () => {
        const articles = [
            createMockArticle({
                title: 'Article 1',
                tagList: ['JavaScript'],
                tagSlugs: ['javascript']
            }),
            createMockArticle({
                title: 'Article 2',
                tagList: ['javascript'],
                tagSlugs: ['javascript']
            })
        ];

        const tagIndex = buildTagIndex(articles);

        // Should have single entry for javascript
        assert(tagIndex.javascript);
        assert.equal(tagIndex.javascript.count, 2);
        // Name should be from first occurrence
        assert.equal(tagIndex.javascript.name, 'JavaScript');
    });

    it('should maintain count accuracy across pipeline', () => {
        const tagsString = 'javascript, web, node.js';
        const { tagList, tagSlugs } = processArticleTags(tagsString);

        const articles = [
            createMockArticle({ title: 'Article 1', tagList, tagSlugs }),
            createMockArticle({ title: 'Article 2', tagList, tagSlugs }),
            createMockArticle({ title: 'Article 3', tagList, tagSlugs })
        ];

        const tagIndex = buildTagIndex(articles);

        assert.equal(tagIndex.javascript.count, 3);
        assert.equal(tagIndex.web.count, 3);
        assert.equal(tagIndex.nodejs.count, 3);
    });

    it('should handle multiple articles with overlapping tags', () => {
        const articles = [
            createMockArticle({
                title: 'Article 1',
                tagList: ['javascript', 'web', 'frontend'],
                tagSlugs: ['javascript', 'web', 'frontend']
            }),
            createMockArticle({
                title: 'Article 2',
                tagList: ['javascript', 'node.js', 'backend'],
                tagSlugs: ['javascript', 'nodejs', 'backend']
            }),
            createMockArticle({
                title: 'Article 3',
                tagList: ['web', 'css', 'html'],
                tagSlugs: ['web', 'css', 'html']
            })
        ];

        const tagIndex = buildTagIndex(articles);

        assert.equal(tagIndex.javascript.count, 2);
        assert.equal(tagIndex.web.count, 2);
        assert.equal(tagIndex.nodejs.count, 1);
        assert.equal(tagIndex.frontend.count, 1);
        assert.equal(tagIndex.backend.count, 1);
        assert.equal(tagIndex.css.count, 1);
        assert.equal(tagIndex.html.count, 1);
    });
});
