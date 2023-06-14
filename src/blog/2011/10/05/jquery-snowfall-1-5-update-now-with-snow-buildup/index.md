---
title: "jQuery Snowfall 1.5 update now with snow buildup!"
date: "2011-10-06"
teaser: "Stay up-to-date with the latest version of the jQuery Snowfall plugin. Experience the added feature of snow buildup, allowing snowflakes to accumulate on specified elements. Learn how to enable this feature and explore other options and methods available. Download the plugin, view it in action, and enhance your website's winter atmosphere."
---

**[Check out the new version here, with the ability to add images to snowflakes!](http://www.somethinghitme.com/2012/12/08/snowfall-1-6/)**

[Repo on Github](https://github.com/loktar00/JQuery-Snowfall) [Download Jquery Snowfall 1.5](https://github.com/loktar00/JQuery-Snowfall/archive/master.zip) [View the plugin in action](http://loktar00.github.com/JQuery-Snowfall/)

Added snow buildup to the plugin, so now you can pass a jquery selector in the collection option and the snow will collect on top of all the elements matched. It uses the canvas tag so the snow wont collect in IE8 or lower. To enable collection you can do the following

```javascript
snowfall({collection : 'element'});
```

Element can be either a class or id or a list such as

```javascript
$(document).snowfall({collection : '.elements'}); 
$(document).snowfall({collection : '#element'}); 
```

Thats pretty much it for new options below is the standard way of using the plugin.

**Invoking the snow**

```javascript
$(document).snowfall(); 
$('#elementid').snowfall({flakeCount : 100, maxSpeed : 10});
$('.class').snowfall({flakeCount : 100, maxSpeed : 10});
```

**Snowfall Methods**

```javascript
// stopping the snow 
$(document).snowfall('clear');
$('#elementid').snowfall('clear');
$('.class').snowfall('clear');
```

**Options currently supported with default values**

```javascript
options = { 
    flakeCount : 35, // number 
    flakeColor : '#ffffff', // string 
    flakeIndex: 999999, // number 
    minSize : 1, // number 
    maxSize : 3, // number 
    minSpeed : 2, // number 
    maxSpeed : 3, // number 
    round : false, // bool 
    shadow : false, // bool 
    collection : 'element' // string 
};
```