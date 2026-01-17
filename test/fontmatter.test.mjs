import { describe, it } from 'node:test';
import assert from 'node:assert';

import { processFrontMatter } from '../index.mjs';

describe('processFrontMatter', () => {
    it('should parse valid YAML frontmatter correctly', () => {
        const content = `---
title: "Dynamic rotated sprite sheets with JavaScript"
date: "2010-02-07"
teaser: "Been working on the single player canvas game."
---
test`;
        const result = processFrontMatter(content);
        assert.deepEqual(result.pageData, {
            title: "Dynamic rotated sprite sheets with JavaScript",
            date: "2010-02-07",
            teaser: "Been working on the single player canvas game."
        });
        assert.equal(result.content.trim(), "test");
    });

    it('should handle content without frontmatter', () => {
        const content = `Just some content without front matter`;
        const result = processFrontMatter(content);
        assert.deepEqual(result.pageData, {});
        assert.equal(result.content, "Just some content without front matter");
    });

    it('should handle empty frontmatter', () => {
        const content = `---
---
Content here`;
        const result = processFrontMatter(content);
        assert.deepEqual(result.pageData, {});
        assert.equal(result.content.trim(), "Content here");
    });

    it('should handle frontmatter with null/empty values', () => {
        const content = `---
title: "Test"
date:
teaser:
---
Content`;
        const result = processFrontMatter(content);
        assert.equal(result.pageData.title, "Test");
        assert.equal(result.pageData.date, null);
        assert.equal(result.pageData.teaser, null);
    });

    it('should handle frontmatter with special characters and quotes', () => {
        const content = `---
title: 'Article with "quotes" and :colons:'
author: "Jane Doe"
description: >
  A multi-line description
  that spans multiple lines
---
Article content`;
        const result = processFrontMatter(content);
        assert.equal(result.pageData.title, 'Article with "quotes" and :colons:');
        assert.equal(result.pageData.author, "Jane Doe");
        assert.ok(result.pageData.description);
        assert.equal(result.content.trim(), "Article content");
    });

    it('should handle frontmatter with arrays', () => {
        const content = `---
title: "Test"
tags:
  - javascript
  - web
  - tutorial
---
Content`;
        const result = processFrontMatter(content);
        assert.equal(result.pageData.title, "Test");
        assert.deepEqual(result.pageData.tags, ["javascript", "web", "tutorial"]);
    });

    it('should handle missing required fields with warnings', () => {
        const content = `---
title: "Test Article"
---
Content without date`;
        const result = processFrontMatter(content);
        assert.equal(result.pageData.title, "Test Article");
        assert.equal(result.pageData.date, undefined);
    });
});