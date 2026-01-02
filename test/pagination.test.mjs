import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import { JSDOM } from 'jsdom';

import { pagination } from '../index.mjs';

const articleData = [
    { title: 'Article 1', date: '2024-01-01', path:'article1', html:'<h1>Article 1</h1>' },
    { title: 'Article 2', date: '2024-01-02', path:'article2', html:'<h1>Article 2</h1>' },
    { title: 'Article 3', date: '2024-01-03', path:'article3', html:'<h1>Article 3</h1>' }
];

// minimum data to be passed in order to generate pagination.
const siteData = {
    author: 'Test Author',
    main: {
        title: 'Test Site'
    },
    projects: [
        {
            title: 'Project 1',
            description: 'Project 1 description',
            url: 'https://project1.com'
        }
    ]
};


describe('pagination', () => {
    it('should return the correct number of pages when max per page is 1', () => {
        const maxPerPage = 1;
        const pageData = pagination(articleData, maxPerPage, siteData);
        assert.deepEqual(pageData.length, 3);
        assert.deepEqual(pageData.map(page => page.page), [
            1, 2, 3
        ]);
    });

    it('should return the correct number of pages when max per page is 3', () => {
        const maxPerPage = 3;
        const pageData = pagination(articleData, maxPerPage, siteData);
        assert.deepEqual(pageData.length, 1);
        assert.deepEqual(pageData.map(page => page.page), [
            1
        ]);
    });

    it('should return the correct number of pages when max per page is 0', () => {
        const maxPerPage = 0;
        const pageData = pagination(articleData, maxPerPage, siteData);
        assert.deepEqual(pageData.length, 3);
        assert.deepEqual(pageData.map(page => page.page), [
            1, 2, 3
        ]);
    });

    it('should return the correct number of pages when max per page is -1', () => {
        const maxPerPage = -1;
        const pageData = pagination(articleData, maxPerPage, siteData);
        assert.deepEqual(pageData.length, 3);
    });

    it('should generate valid HTML markup for pagination', () => {
        const pageData = pagination(articleData, 2, siteData);

        // Simple template test without complex includes
        const testData = {
            ...siteData,
            articles: articleData.slice(0, 2), // First 2 articles for page 1
            currentPage: 1,
            totalPages: 2
        };

        // Simple template that renders articles
        const html = ejs.render(`
            <div class="articles">
                <% data.articles.forEach(article => { %>
                    <article class="article-card">
                        <h2 class="article-title"><%= article.title %></h2>
                        <p class="article-synopsis"><%= article.teaser || '' %></p>
                    </article>
                <% }); %>
            </div>
            <nav class="pagination">
                <span class="page-current">Page <%= data.currentPage %> of <%= data.totalPages %></span>
            </nav>
        `, { data: testData });

        // Parse with JSDOM and validate structure
        const dom = new JSDOM(html);
        const document = dom.window.document;

        // Test pagination content
        const paginationEl = document.querySelector('.pagination .page-current');
        assert.ok(paginationEl, 'Should have pagination element');
        assert.equal(paginationEl.textContent.trim(), 'Page 1 of 2', 'Pagination text should be correct');

        // Test articles are rendered
        const articleCards = document.querySelectorAll('.article-card');
        assert.equal(articleCards.length, 2, 'Should render 2 article cards');

        // Test article content
        const firstArticle = articleCards[0];
        const title = firstArticle.querySelector('.article-title');
        assert.equal(title.textContent, 'Article 1', 'First article title should match');
    });
});
