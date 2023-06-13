---
title: "Snowfall 1.6"
date: "2012-12-08"
teaser: "Let it snow! Experience the magic of winter with Snowfall 1.6. Learn how to add snowfall effects to your website using jQuery or pure JavaScript. Get ready to create a winter wonderland!"
---

[Repo on Github](https://github.com/loktar00/JQuery-Snowfall) [Download Jquery Snowfall 1.6](https://github.com/loktar00/JQuery-Snowfall/archive/master.zip) [View the plugin in action](http://loktar00.github.com/JQuery-Snowfall/)

You can now use images for snowflakes!

\[sourcecode language="js"\] // jQuery vs $(document).snowfall({image :"images/flake.png", minSize: 10, maxSize:32});

// purejs vs snowFall.snow(document.body, {image : "images/flake.png", minSize: 10, maxSize:32}); \[/sourcecode\]

**Invoking the snow**

\[sourcecode language="js"\] $(document).snowfall(); $('#elementid').snowfall({flakeCount : 100, maxSpeed : 10}); $('.class').snowfall({flakeCount : 100, maxSpeed : 10}); \[/sourcecode\]

**Snowfall Methods**

\[sourcecode language="js"\] // stopping the snow $(document).snowfall('clear'); $('#elementid').snowfall('clear'); $('.class').snowfall('clear'); \[/sourcecode\]

**Options currently supported with default values**

\[sourcecode language="js"\] options = { flakeCount : 35, // number flakeColor : '#ffffff', // string flakeIndex: 999999, // number minSize : 1, // number maxSize : 3, // number minSpeed : 2, // number maxSpeed : 3, // number round : false, // bool shadow : false, // bool collection : 'element' // string }; \[/sourcecode\]

**Example**

<script type="text/javascript" src="http://www.somethinghitme.com/wp-content/themes/somethinghitme/js/snowfall.min.jquery.js"></script>

<script type="text/javascript">// <![CDATA[ $(document).ready(function(){$('#snow-window').snowfall({flakeCount : 100, maxSpeed : 10}); $('#stopsnow').click(function(){ $('#snow-window').snowfall('clear')});}); // ]]></script>
