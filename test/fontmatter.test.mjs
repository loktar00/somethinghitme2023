import { describe, it } from 'node:test';
import assert from 'node:assert';

import { processFrontMatter } from '../index.mjs';

describe('processFrontMatter', () => {
    it('should return the front matter and content', () => {
        const content = `---
            title: "Dynamic rotated sprite sheets with JavaScript"
            date: "2010-02-07"
            teaser: "Been working on the single player canvas game."
        ---
        test`;
        const result = processFrontMatter(content);
        assert.deepEqual(result, {pageData: {title: "Dynamic rotated sprite sheets with JavaScript", date: "2010-02-07", teaser: "Been working on the single player canvas game."}, content: "test"});
    });

    it('should handle missing front matter gracefully', () => {
        const content = `Just some content without front matter`;
        const result = processFrontMatter(content);
        assert.deepEqual(result, {pageData: {}, content: "Just some content without front matter"});
    });

    it('should handle malformed front matter with missing closing delimiter', () => {
        const content = `---
            title: "Test Article"
        Content without proper closing`;
        const result = processFrontMatter(content);
        // Should return empty pageData and original content
        assert.deepEqual(result.pageData, {});
        assert.equal(result.content, content);
    });

    it('should handle front matter with invalid YAML syntax', () => {
        const content = `---
            title: "Test Article"
            invalid: [unclosed bracket
            date: "2024-01-01"
        ---
        Content here`;
        const result = processFrontMatter(content);
        // Should handle parsing errors gracefully
        assert.ok(result.pageData, 'Should return pageData object');
        assert.ok(result.content, 'Should return content');
    });

    it('should handle empty front matter', () => {
        const content = `---
---
        Content here`;
        const result = processFrontMatter(content);
        assert.deepEqual(result.pageData, {});
        assert.equal(result.content.trim(), "Content here");
    });

    it('should handle front matter with only whitespace', () => {
        const content = `---
title:
date:
        ---
        Actual content`;
        const result = processFrontMatter(content);
        assert.deepEqual(result, {
            pageData: { title: '', date: '' },
            content: "Actual content"
        });
    });

    it('should handle front matter with special characters', () => {
        const content = `---
            title: "Article with "quotes" and :colons:"
        ---
        Article content`;
        const result = processFrontMatter(content);
        assert.equal(result.pageData.title, 'Article with "quotes" and :colons:');
        assert.equal(result.content, 'Article content');
    });
});