---
title: "Recreating this blog with static generation"
date: "2023-06-15"
teaser: "Join me on my journey of recreating my blog using a custom static generation solution. Discover the challenges I faced with platforms like WordPress and Gatsby, and my desire for a simpler approach. I explain the code structure, including markdown parsing and metadata extraction, as well as additional parsing for code blocks and gists. Templating with EJS and hosting on GitHub Pages are also covered."
tags: "blog, javascript, static generation, programming"
---

## The Problem

Recently I found myself in between jobs so I had some time on my hands to work on a few of my projects I've let languish over the past few years. I always find myself coming back to this blog since it's low risk so I consider it a playground for me to test things out.

### A bit of history 2009 - 2020

A quick history on this blog and the interations it's had. Back in 2009 when blogs were all the rage I threw up a wordpress install made a custom theme and operated using that for years on a shared hosting platform. It worked well for the most part but over the years and with wordpress upgrades and plugins it just became more of a pain. At the end of the day all I really needed were some static pages with my thoughts and images.

### 2020

Moving on to 2020 I decided to "upgrade" to Gatsby. There was a bit of hype surrounding it, it used React which I consider myself pretty proficient in, and it generated a static site, exactly what I wanted. This also had the side benefit of allowing me to move hosting to github.

While I found gatsby to be simple for the most part, I just couldn't get over the setup and amount of code needed for something so "simple"... it's something I see everywhere in the development world especially in the front end or Javascript ecosystem. Everything requires a build now.. a build process, multiple dependencies just to get something to show on the page. I went a long with it since the goal was just to convert the site and have some of my older blog posts available. to users.

The issue I had when writing articles most recently is after updating to using Gatsby I found myself spending over an hour or more each time I wanted to add an article since they were so far and few between. I needed to update dependencies to fix issues and of course account for breaking changes. Maybe it's just me, I generally don't run into these issues but Gatsby seemed to always have something going on where the site wouldn't just "build". 

In reality all I wanted to do was sit down write up a markdown file and publish it without thinking about the tech behind the solution.

The other thing I started to get annoyed with was the complexity of wrapping my head around how Gatsby used graphQL with the actual markdown files. I found some cases where weird things would happen with excerpts, and simple things such as using pagination on the main page just seemed overly complex.

## The Solution - present

I've been doing a bit of work in node lately (moreso than usual) so came up with a quick and easy plan to get the blog up and running in a state where I could just sit down and create posts. I decided to create a simple node script to generate the entire site from markdown files and json data. This way I could easily write my articles in markdown and not have to worry about the tech behind the scenes.

The solution I feel is pretty simple overall, there's definitely a lot of room for improvement but my goal was to not spend more than a day on the overall solution so I could actually get to the important part of the site, the content.

I decided to host the site publically this time around, all code is located on my githup profile [here](https://github.com/loktar00/somethinghitme2023).

### The code

The articles all live under `src/blog` and are organized by years, and for the older articles the month and day. The script iterates over the directories grabbing each file and parsing the markdown using [showdown](https://www.npmjs.com/package/showdown) (so far 1 of the total 2 dependencies for the site/).

I continued to use a similar format I had when using gatsby. At the top of each markdown file there's a section to hold metadata associated with each artcile. Here's an example for this one.

```markdown
---
title: "Recreating this blog with static generation"
date: "2023-06-15"
teaser: "Updated this blog yet again, however this time used my own solution which generates the entire site from markdown and json data, making it much easier to maintaijn and actually write for."
tags: "blog, javascript, static generation, programming"
---
```

I then parse the markdown when it's being read and extract the information to expose to our templates.

#### Additional parsing

I do have some `gists` and lots of code blocks, so I went with a pretty simple approach of parsing out the code blocks and just replacing with prism for syntax highligting. I do the same for the gists as well. I also allow for vanilla markup and scripts so I can just drop in some html if I need to.

#### Templating

For templating I went with a pretty simple solution, our second dependency is ejs, which I've always been a pretty big fan of. Once the node script finishes running it creates a JSON structure for the entire site which is passed into our ejs templates to create each post, create next and previous (for the articles as of today). It then saves each file to the appropriate directory as a static html file.

#### Styling

For styling I'm just using vanilla css, I might change that to SCSS since I'm a huge fan of nesting (I can't wait for the day that's supported natively!).

### Hosting

For hosting I'm sticking with github pages. Each commit to the main branch triggers an action which builds everything to github pages so I have a pretty worry free experience.

### Improvmements

Beyond just making improvements for mobile, I'm not in love with the main page design when it comes to layout, definitely needs more images. I also do want to go back to a pages main page and need to add tags so I can organize articles in the side bar a bit like I used to with wordpress. Might as well add a timeline as well. As of right now I'm overall happy, not bad for a days worth of work.

### Conclusion

Will I end up writing more? Who knows, I feel like I only come to this blog when I don't have an existing project and I want to sink time into something that feels relevant. I've told myself I need to start documenting what I do more in the hopes of helping others however in the back of my mind I wonder how relevant any of this will be with tools like chatGPT. Only time will tell.

