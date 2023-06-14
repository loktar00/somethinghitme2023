---
title: "Jquery Snowfall Plugin 1.4"
date: "2010-12-09"
teaser: "Access an updated version of the jQuery Snowfall plugin, offering new features like rounded flakes and shadows. Learn how to invoke the snowfall effect, clear the snow, and customize various options. Download the plugin and enhance your website with a touch of winter magic."
---

**[Newer version available](http://www.somethinghitme.com/2011/10/05/jquery-snowfall-1-5-update-now-with-snow-buildup/)**

 

Added a few new things, you can now make flakes rounded (Thanks Luke), and give them shadows (for lighter colored pages) - thanks for the idea Yutt. Also I fixed some bugs that cause horizontal bar flickering (I hope).

[Download Jquery Snowfall 1.4](http://www.somethinghitme.com/wp-content/uploads/2010/12/snowfall.jquery.zip)

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
    shadow : false // bool 
    };
```