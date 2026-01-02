import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import { JSDOM } from 'jsdom';

/**
 * Integration tests for EJS template rendering with partials
 * This shows how to test actual HTML output including includes
 */

describe('Template Integration Tests', () => {

    // Mock file system for EJS includes during testing
    const createMockFileSystem = () => {
        const mockFiles = {
            '/src/templates/partials/head.ejs': `<head>
    <meta charset="utf-8" />
    <title><%= title %></title>
    <link href="/styles/styles.css" rel="stylesheet" />
</head>`,
            '/src/templates/partials/header.ejs': `<header class="container">
    <nav class="site-header">
        <button class="logo-trigger">Theme</button>
        <a href="/" class="logo-text">Test Site</a>
    </nav>
</header>`,
            '/src/templates/partials/social.ejs': `<section class="author-section">
    <img src="/assets/avatar.jpg" alt="Test Author" class="author-avatar">
    <div class="author-info">
        <h3 class="author-name"><%= data.author.name %> (<%= data.author.handle %>)</h3>
        <p class="author-bio"><%= data.author.tagline %></p>
    </div>
</section>`
        };

        // Override EJS fileLoader to use our mocks
        const originalFileLoader = ejs.fileLoader;
        ejs.fileLoader = (filePath) => {
            // Handle our mock includes
            const mockKey = filePath.replace(/\\/g, '/').replace(process.cwd().replace(/\\/g, '/') + '/', '/');
            if (mockFiles[mockKey]) {
                return mockFiles[mockKey];
            }
            // Try to read actual files
            try {
                return fs.readFileSync(filePath, 'utf8');
            } catch {
                return `<!-- Mock: ${filePath} -->`;
            }
        };

        return () => {
            // Restore original function
            ejs.fileLoader = originalFileLoader;
        };
    };

    it('should render article page with correct structure', () => {
        const restoreMock = createMockFileSystem();

        try {
            const articleData = {
                title: 'Test Article',
                date: '2024-01-01',
                tags: 'javascript, testing',
                html: '<p>This is test content</p>',
                author: {
                    name: 'Test Author',
                    handle: 'testuser',
                    tagline: 'A test author'
                },
                main: {
                    title: 'Test Site'
                }
            };

            const template = `<!DOCTYPE html>
<html lang="en" data-theme="light">
    <%- include('/src/templates/partials/head', {title: \`\${data.title} - \${data.main.title}\`}) %>
    <body>
        <div class="layout">
            <%- include('/src/templates/partials/header') %>
            <main class="container">
                <article class="article-content">
                    <header class="article-header">
                        <h1 class="article-title"><%- data.title %></h1>
                        <div class="article-meta-row">
                            <time datetime="<%- data.date %>"><%- new Date(data.date).toLocaleDateString() %></time>
                            <span>&bull;</span>
                            <span class="article-tag"><%- data.tags %></span>
                        </div>
                    </header>
                    <section><%- data.html %></section>
                </article>
                <%- include('/src/templates/partials/social') %>
            </main>
        </div>
    </body>
</html>`;

            const html = ejs.render(template, { data: articleData }, { root: process.cwd() });
            const dom = new JSDOM(html);
            const document = dom.window.document;

            // Test basic HTML structure
            assert.ok(document.querySelector('html'), 'Should have html element');
            assert.ok(document.querySelector('head'), 'Should have head element');
            assert.ok(document.querySelector('body'), 'Should have body element');

            // Test title interpolation
            const title = document.querySelector('title');
            assert.ok(title, 'Should have title element');
            assert.equal(title.textContent, 'Test Article - Test Site', 'Title should be interpolated correctly');

            // Test article content
            const articleTitle = document.querySelector('.article-title');
            assert.ok(articleTitle, 'Should have article title');
            assert.equal(articleTitle.textContent, 'Test Article', 'Article title should match data');

            const articleContent = document.querySelector('.article-content p');
            assert.ok(articleContent, 'Should have article content');
            assert.equal(articleContent.textContent, 'This is test content', 'Article content should match HTML');

            // Test social section with partial
            const socialSection = document.querySelector('.author-section');
            assert.ok(socialSection, 'Should have social section from partial');

            const authorName = document.querySelector('.author-name');
            assert.ok(authorName, 'Should have author name');
            assert.equal(authorName.textContent, 'Test Author (testuser)', 'Author name should be formatted correctly');

        } finally {
            restoreMock();
        }
    });

    it('should handle malformed data gracefully', () => {
        const restoreMock = createMockFileSystem();

        try {
            const badData = {
                title: null, // Missing title
                date: null, // Missing date (not just invalid string)
                tags: undefined, // Missing tags
                html: '<p>Content</p>',
                author: { name: 'Test' },
                main: { title: 'Site' }
            };

            const template = `<article>
    <h1><%- data.title || 'Untitled' %></h1>
    <time><%- data.date || 'No date' %></time>
    <div class="content"><%- data.html %></div>
</article>`;

            const html = ejs.render(template, { data: badData }, { root: process.cwd() });
            const dom = new JSDOM(html);
            const document = dom.window.document;

            // Should handle null/undefined gracefully
            const title = document.querySelector('h1');
            assert.equal(title.textContent, 'Untitled', 'Should handle null title');

            const time = document.querySelector('time');
            assert.equal(time.textContent, 'No date', 'Should handle null date');

        } finally {
            restoreMock();
        }
    });

    it('should validate HTML structure with JSDOM', () => {
        const restoreMock = createMockFileSystem();

        try {
            const html = ejs.render(`
                <div class="test">
                    <h1>Test Header</h1>
                    <p>Test paragraph</p>
                    <ul>
                        <li>Item 1</li>
                        <li>Item 2</li>
                    </ul>
                </div>
            `, {}, { root: process.cwd() });

            const dom = new JSDOM(html);
            const document = dom.window.document;

            // Test DOM structure
            const container = document.querySelector('.test');
            assert.ok(container, 'Should have test container');

            const header = container.querySelector('h1');
            assert.equal(header.textContent, 'Test Header', 'Header should have correct text');

            const paragraphs = container.querySelectorAll('p');
            assert.equal(paragraphs.length, 1, 'Should have one paragraph');

            const listItems = container.querySelectorAll('li');
            assert.equal(listItems.length, 2, 'Should have two list items');

        } finally {
            restoreMock();
        }
    });
});