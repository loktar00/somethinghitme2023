console.log('Script starting...');

import fs  from 'fs';
import path from 'path';
import { readdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import ejs from 'ejs';
import showdown from 'showdown';
import sharp from 'sharp';

// =============================================================================
// CONFIGURATION
// =============================================================================
const CONFIG = {
    sharedPath: 'blog',
    sourcePath: 'src',
    publicPath: 'public',
    siteDataPath: 'siteData',
    templatePath: 'templates',
    articlesPerPage: 10,
    copyDirectories: [
        'styles',
        'js',
        'assets',
        'projects',
        'CNAME'
    ]
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Walk function adapted from https://stackoverflow.com/a/71166133/322395 by user CertainPerformance
 * Recursively walks a directory and returns all file paths
 */
const walk = async (dirPath) => Promise.all(
    await readdir(dirPath, { withFileTypes: true })
    .then((entries) => entries.map((entry) => {
        const childPath = join(dirPath, entry.name)
        return entry.isDirectory() ? walk(childPath) : childPath
    }))
);

/**
 * Converts backslashes to forward slashes for consistent path handling
 */
const convertBackslashes = path => path.replace(/\\/g, '/');

// Copy sync copies files and all the directories.
const copyFiles = (source, target) => {
    fs.cpSync(source,target, {recursive: true});
}

// Create a directory if it doesn't exist
const createDirectory = (dirPath) => {
    if (!fs.existsSync(dirPath)){
        // Create the directories since they don't exist
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// Create the public directory if it doesn't exist
createDirectory(CONFIG.publicPath);

// =============================================================================
// PROCESS MARKDOWN FILES
// =============================================================================

// Front matter - Information in each of the markdown files that is used to generate the page.
export const processFrontMatter = (content) => {
    try {
        const pattern = /---([\s\S]*?)---/;
        const matches = content.match(pattern);
        let pageData = {};

        if (matches) {
            for (const match of matches) {
                const contentBetweenDelimiters = match.replace(/---/g, '').trim();
                if (contentBetweenDelimiters.trim()) {
                    contentBetweenDelimiters.split('\n')
                        .forEach(line => {
                            try {
                                // Skip empty lines
                                if (!line.trim()) {
                                    return;
                                }

                                const colonIndex = line.indexOf(':');
                                if (colonIndex === -1) {
                                    console.warn(`Warning: Skipping malformed frontmatter line (no colon): "${line}"`);
                                    return;
                                }

                                const key = line.substring(0, colonIndex).trim();
                                const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');

                                if (key) {
                                    pageData[key] = value;
                                }
                            } catch (lineError) {
                                console.warn(`Warning: Error parsing frontmatter line "${line}":`, lineError.message);
                            }
                        });
                }
            }
        }

        return {pageData, content: content.replace(pattern, '').trim()};
    } catch (error) {
        console.error('Error processing frontmatter:', error.message);
        // Return safe defaults on error
        return {
            pageData: { title: 'Untitled', date: new Date().toISOString().split('T')[0] },
            content: content
        };
    }
}

// Markdown content
const processMarkdownContent = (file, content) => {
    const filePath = file.replace(/\index.md$/, '');

    let textToConvert = content;
    // Path to save the assets
    let savePath = filePath.replace(`${CONFIG.sourcePath}/${CONFIG.sharedPath}/`, '');

    // We're in windows.
    if (file.includes(`${CONFIG.sourcePath}\\${CONFIG.sharedPath}\\`)) {
        savePath = filePath.replace(`${CONFIG.sourcePath}\\${CONFIG.sharedPath}\\`, '');
    }

    // Process images
    // Update all image paths to be absolute paths
    const imagePattern = /images\/(.*)\.(.*)/g;
    const imageMatches = textToConvert.match(imagePattern);

    // replace all image paths with absolute paths to the images
    if (imageMatches) {
        imageMatches.forEach(match => {
            // replace file extension jpg, jpeg, and png with webp
            const newFileName = match.replace(/\.(png|jpg|jpeg)/, '.webp');
            textToConvert = textToConvert.replace(match, `/${convertBackslashes(savePath)}${convertBackslashes(newFileName)}`);
        });
    }

    // Embed gists.
    const gistPattern = /\\\[gist id=(?<id>[\d]*)\\\]/g;
    for (const match of textToConvert.matchAll(gistPattern)) {
        textToConvert = textToConvert.replace(match[0], `<script src="http://gist.github.com/${match.groups.id}.js"></script>`);
    }

    // Convert the markdown to html
    // Initialize showdown converter
    const converter = new showdown.Converter();
    const html = converter.makeHtml(textToConvert);

    return {
        html,
        savePath
    }
}

// copy over all article internal assets
const saveAsset = async (file) => {
    let savePath = file.replace(`${CONFIG.sourcePath}/${CONFIG.sharedPath}/`, '');

    // If we're in windows.
    if (file.includes(`${CONFIG.sourcePath}\\${CONFIG.sharedPath}\\`)) {
        savePath = file.replace(`${CONFIG.sourcePath}\\${CONFIG.sharedPath}\\`, '');
    }

    // Smart WebP conversion - only convert if WebP doesn't exist or source is newer
    if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        const webpPath = path.join(CONFIG.publicPath, savePath.replace(/\.(png|jpg|jpeg)$/, '.webp'));
        const sourceStats = fs.statSync(file);

        // Check if WebP already exists in source directory
        const sourceWebpPath = file.replace(/\.(png|jpg|jpeg)$/, '.webp');
        let needsConversion = true;

        try {
            const sourceWebpStats = fs.statSync(sourceWebpPath);
            // Only convert if source PNG is newer than existing WebP
            needsConversion = sourceStats.mtime > sourceWebpStats.mtime;
        } catch {
            // WebP doesn't exist in source, so we need to create it
            needsConversion = true;
        }

        if (needsConversion) {
            console.log(`Converting ${savePath} to WebP...`);

            // Ensure directory exists in public
            const webpDir = path.dirname(webpPath);
            if (!fs.existsSync(webpDir)) {
                fs.mkdirSync(webpDir, { recursive: true });
            }

            // Generate WebP and save to both source and public
            await sharp(file)
                .webp({ quality: 85 })
                .toFile(webpPath);

            // Also save to source directory for future builds
            const sourceWebpDir = path.dirname(sourceWebpPath);
            if (!fs.existsSync(sourceWebpDir)) {
                fs.mkdirSync(sourceWebpDir, { recursive: true });
            }
            await sharp(file)
                .webp({ quality: 85 })
                .toFile(sourceWebpPath);
        } else {
            console.log(`Skipping ${savePath} - WebP already up to date`);
            // Copy existing WebP from source to public
            fs.cpSync(sourceWebpPath, webpPath);
        }

        // Always copy the original image file too (for browsers that don't support WebP)
        fs.cpSync(file, path.join(CONFIG.publicPath, savePath));
    } else {
        // Copy non-image assets as before
        fs.cpSync(file, path.join(CONFIG.publicPath, savePath));
    }
}

// =============================================================================
// Prepare Global Site Data
// =============================================================================
const prepareSiteData = async () => {
    // Merge the data files and article data into a single json file to use with ejs
    const dataFiles = await walk(`./${CONFIG.sourcePath}/${CONFIG.siteDataPath}`);

    // Data passed down to each of the ejs templates
    let siteData = {};

    dataFiles.forEach(file => {
        const data = fs.readFileSync(file, 'utf8');
        siteData = {...siteData, ...JSON.parse(data)}
    });

    return siteData;
}

// =============================================================================
// MAIN SITE ARTICLE PAGINATION
// =============================================================================
const savePages = (pageData, savePath) => {
    if (pageData.page === 1) {
        fs.writeFileSync(path.join(savePath, 'index.html'), pageData.markup);
    }
    // We still will create a page-1.html file for the first page.
    createDirectory(path.join(savePath, 'page'));
    fs.writeFileSync(path.join(savePath, `page/${pageData.page}.html`), pageData.markup);
}

export const pagination = (articleData, articlesPerPage, siteData) => {
    const totalPages = Math.ceil(articleData.length / Math.max(articlesPerPage, 1));

    let pageData = [];
    for (let page = 1; page <= totalPages; page++) {
        const startIndex = (page - 1) * articlesPerPage;
        const endIndex = startIndex + articlesPerPage;
        const pageArticles = articleData.slice(startIndex, endIndex);
        const markup = ejs.render(fs.readFileSync(`./${CONFIG.sourcePath}/${CONFIG.templatePath}/index.ejs`, 'utf8'), {
            data: {
                ...siteData,
                articles: pageArticles,
                currentPage: page,
                totalPages: totalPages
            }
        }, {root: process.cwd()});

        pageData.push({
            page,
            markup
        });
    }
    return pageData;
}

// =============================================================================
// ARTICLE PAGE GENERATION
// =============================================================================
const processArticles = (articleData, siteData) => {
    // Iterate over our files convert to html and save them in the appropriate location.
    articleData.forEach((article, idx) => {
        createDirectory(path.join(CONFIG.publicPath, article.path));

        const previousArticle = idx && articleData[idx - 1] || {};
        const nextArticle = idx < articleData.length - 1 && articleData[idx + 1] || {};

        const articlePost = ejs.render(fs.readFileSync(`./${CONFIG.sourcePath}/${CONFIG.templatePath}/article.ejs`, 'utf8'),
            {data: {...siteData, ...article, ...{previousArticle: previousArticle}, ...{nextArticle: nextArticle}}},
            { root: process.cwd()}
        );
        // Save the article to the appropriate location
        fs.writeFileSync(path.join(CONFIG.publicPath, `${article.path}/index.html`), articlePost);
    });
}

// =============================================================================
// BUILD THE SITE
// =============================================================================
const build = async () => {
    try {
        console.log('🚀 Starting build process...');

        // In development mode, don't delete the entire directory to avoid conflicts with running server
        if (process.env.NODE_ENV !== 'development') {
            await rm(CONFIG.publicPath, { recursive: true, force: true });
            // Recreate the directory.
            if (!fs.existsSync(CONFIG.publicPath)){
                fs.mkdirSync(CONFIG.publicPath);
            }
        }

        const allFiles = await walk(`./${CONFIG.sourcePath}/${CONFIG.sharedPath}`);
        const markdownFiles = allFiles.flat(Number.POSITIVE_INFINITY).filter(file => file.endsWith('.md'));
        const assetFiles = allFiles.flat(Number.POSITIVE_INFINITY).filter(file => !file.endsWith('.md'));

        const htmlfiles = markdownFiles.map(file => {
            const { pageData, content } = processFrontMatter(fs.readFileSync(file, 'utf8'));
            const { html, savePath } = processMarkdownContent(file, content);
            return {pageData: {...pageData, ...{path: savePath, ...{html: html}}}};
        });

        // Sort article data in reverse chronological order
        const articleData = htmlfiles.map(file => file.pageData);

        articleData.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        });

        // Save all of the assets (process sequentially to avoid file conflicts)
        for (const file of assetFiles) {
            await saveAsset(file);
        }

        // Copy over all of our directories we need directly with files included
        CONFIG.copyDirectories.forEach(dir => {
            copyFiles(`./${CONFIG.sourcePath}/${dir}`, path.join(CONFIG.publicPath, dir));
        });

        // Minify assets for production
        // await minifyAssets(path.join(CONFIG.publicPath, "js"));

        // Prepare the site data
        let siteData = await prepareSiteData();
        // Add the article data to the site data
        siteData = {...siteData, ...{articles: articleData}};

        // Paginate the articles
        const pageData = pagination(articleData, CONFIG.articlesPerPage, siteData);
        pageData.forEach(page => {
            savePages(page, CONFIG.publicPath);
        });

        // Process the articles
        processArticles(articleData, siteData);
        console.log('✅ Build completed successfully!');
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

// Run build only when this file is executed directly (not imported)
if (import.meta.url === `file:///${process.argv[1]}`.replace(/\\/g, '/')) {
    build();
}