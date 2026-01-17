---
title: "Snowfall 1.6"
date: "2012-12-08"
teaser: "Snowfall 1.6 adds image-based flakes and a pure JavaScript API alongside the jQuery version. This post shows how to start it, clear it, and the options you can tweak."
---

[Repo on Github](https://github.com/loktar00/JQuery-Snowfall) [Download jQuery Snowfall 1.6](https://github.com/loktar00/JQuery-Snowfall/archive/master.zip) [View the plugin in action](http://loktar00.github.com/JQuery-Snowfall/)

You can now use images for snowflakes!

```javascript
// jQuery vs
$(document).snowfall({image :"image/flake.png", minSize: 10, maxSize:32});

// purejs vs
snowFall.snow(document.body, {image : "image/flake.png", minSize: 10, maxSize:32});
```

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

