---
title: "Extracting the subdomain with node.js"
date: "2014-07-25"
teaser: "A simple Express pattern for reading the host header, pulling out the subdomain, and normalizing hyphens so you can drive behavior off `whatever.yourdomain.com with` a wildcard DNS entry."
tags: "javascript, node.js, tutorial"
---

Years ago I made some novelty sites with php/apache that used the subdomain to display different messages to the user, I decided to remake one of them using node and wanted to share how this could be done, it was much simpler than I thought it would be.

For this I used [express](http://expressjs.com/), you could do it without pretty easily but express makes it so simple easy to get everything off the ground running. Once you install express you just need to update your routes/index.js to the following.

```javascript

exports.index = function(req, res){
    var domain = req.headers.host, subDomain = domain.split('.');

    if (subDomain.length > 2) {
        subDomain = subDomain[0].split("-").join(" ");
    } else {
        subDomain = "Everyone ";
    }

    res.render('index', { subDomain: subDomain }); };
```

It's pretty self explanatory but I'll go through it regardless. First we grab the domain host from the request headers, then we do a split on the period this will give us the subdomain and the domain. So a request such as

> bob.everyonelovesyou.com

should give us

```javascript
    ['bob', 'everyonelovesyou']
```

We only care about bob, so if we have the subdomain we split any hyphens and then rejoin with a space so phrases can be passed in such as

> seriously-bob.everyonelovesyou.com

and it will become

> 'seriously bob'

We then just need to pass this to the view so they can be accessed.  I use ejs so I can access the subDomain in the view like so

```html
<%= subDomain %>
```

The final step is to make sure set a wildcard cname for your domain like the following

*.yourdomain.com

So you can catch all the incoming subdomains. [And here is an example of a site in action](http://some-text.fuckinghatesyou.com)

[You can get the code from the above site from github](https://github.com/loktar00/effinhatesyou)
