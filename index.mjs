import fs  from 'fs';
import path from 'path';
import { readdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import ejs from 'ejs';
import showdown from 'showdown';

// Initialize showdown converter
const converter = new showdown.Converter();

// Walk function from https://stackoverflow.com/a/71166133/322395
const walk = async (dirPath) => Promise.all(
    await readdir(dirPath, { withFileTypes: true })
    .then((entries) => entries.map((entry) => {
        const childPath = join(dirPath, entry.name)
        return entry.isDirectory() ? walk(childPath) : childPath
    }))
);

const convertBackslashes = path => path.replace(/\\/g, '/');

// Copy sync copies files and all the directories.
const copyFiles = (source, target) => {
    fs.cpSync(source,target, {recursive: true});
}

const sharedPath = 'blog';
const sourcePath = 'src';
const allFiles = await walk(`./${sourcePath}/${sharedPath}`);
const markdownFiles = allFiles.flat(Number.POSITIVE_INFINITY).filter(file => file.endsWith('.md'));
const assetFiles = allFiles.flat(Number.POSITIVE_INFINITY).filter(file => !file.endsWith('.md'));
const htmlFiles = [];
const articleData = [];

markdownFiles.forEach(file => {
    const filePath = file.replace(/\index.md$/, '');
    const text = fs.readFileSync(file, 'utf8');

    // Grab the information from each file to generate our table of contents and structure
    const pattern = /---([\s\S]*?)---/g;
    const matches = text.match(pattern);
    let pageData = {};

    if (matches) {
        for (const match of matches) {
            const contentBetweenDelimiters = match.replace(/---/g, '').trim();
            contentBetweenDelimiters.split('\n')
                .forEach(line => {
                    const data = line.split(':');
                    const key = data[0].trim();
                    const value = data[1].trim().replace(/"/g, '');
                    pageData[key] = value;
                });
        }
    }
 
    // Get rid of the article metadata
    let textToConvert = text.replace(pattern, '').trim();

    // Path to save the article
    const savePath = filePath.replace(`${sourcePath}\\${sharedPath}\\`, '');

    // Update all image paths to be absolute paths
    const imagePattern = /images\/(.*)\.(.*)/g;
    const imageMatches = textToConvert.match(imagePattern);

    // replace all image paths with absolute paths to the images
    if (imageMatches) {
        imageMatches.forEach(match => {
            textToConvert = textToConvert.replace(match, `/${convertBackslashes(savePath)}${convertBackslashes(match)}`);
        });
    }

    // Convert the markdown to html
    const html = converter.makeHtml(textToConvert);
    articleData.push({...{path: savePath}, ...pageData, ...{html}});
    htmlFiles.push({path: savePath, html});
});

// Sort article data in reverse chronological order
articleData.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
});

// save all files to public
const publicPath = './public';

// Clean up the public directory
await rm(publicPath, { recursive: true, force: true });

// Recreate the directory.
if (!fs.existsSync(publicPath)){
    fs.mkdirSync(publicPath);
} 

const createDirectory = (dirPath) => {
    if (!fs.existsSync(dirPath)){
        // Create the directories since they don't exist
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// copy over all article internal assets
assetFiles.forEach(file => {
    // Path to save the assets
    let savePath = file.replace(`${sourcePath}/${sharedPath}/`, '');

     // We're in windows.
    if (file.includes(`${sourcePath}\\${sharedPath}\\`)) {
        savePath = file.replace(`${sourcePath}\\${sharedPath}\\`, '');
    }

    fs.cpSync(file, path.join(publicPath, savePath));
});

// Copy over the CSS 
copyFiles(`./${sourcePath}/styles`, path.join(publicPath, 'styles'));

// Copy over any static JS we have
copyFiles(`./${sourcePath}/js`, path.join(publicPath, 'js'));

// Copy over any assets we have
copyFiles(`./${sourcePath}/assets`, path.join(publicPath, 'assets'));

// Prepare the site data
// Merge the data files and article data into a single json file to use with ejs
const siteDataPath = 'siteData';
const dataFiles = await walk(`./${sourcePath}/${siteDataPath}`);

// Data passed down to each of the ejs templates
let siteData = {};

dataFiles.forEach(file => {
    const data = fs.readFileSync(file, 'utf8');
    siteData = {...siteData, ...JSON.parse(data)}
});

siteData = {...siteData, ...{articles: articleData}};

const templatePath = 'templates';

// Render EJS templates
const indexHtml = ejs.render(fs.readFileSync(`./${sourcePath}/${templatePath}/index.ejs`, 'utf8'), 
    {data: siteData},
    {root: process.cwd()}
);

// Save the main index.html file
fs.writeFileSync(path.join(publicPath, 'index.html'), indexHtml);

// Iterate over our files convert to html and save them in the appropriate location.
articleData.forEach((article, idx) => {
    createDirectory(path.join(publicPath, article.path));

    const previousArticle = idx && articleData[idx - 1] || {};
    const nextArticle = idx < articleData.length - 1 && articleData[idx + 1] || {};

    const articlePost = ejs.render(fs.readFileSync(`./${sourcePath}/${templatePath}/article.ejs`, 'utf8'),
        {data: {...siteData, ...article, ...{previousArticle: previousArticle}, ...{nextArticle: nextArticle}}},
        { root: process.cwd()}
    );
    // Save the article to the appropriate location
    fs.writeFileSync(path.join(publicPath, `${article.path}/index.html`), articlePost);
});


