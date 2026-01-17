---
title: "Jquery Snowfall Plugin 1.3"
date: "2010-04-30"
teaser: "Plugin has been updated to 1.4 please go here for more up to date information. Updated fixed a bug, and added an example file to show how to use the plugin. Added a few new things to the Jquery snowfall plugin, you now have the ability to clear the snow from elements.."
tags: "javascript, jquery, plugin"
---

## [**Plugin has been updated to 1.4 please go here for more up to date information**](http://www.somethinghitme.com/2010/12/09/jquery-snowfall-plugin-1-4/)

\*Updated\* fixed a bug, and added an example file to show how to use the plugin.

Added a few new things to the Jquery snowfall plugin, you now have the ability to clear the snow from elements, chaining is supported, and element matching is supported. Its funny today was the hottest day of the year so far and I decided to work on a script to make it snow.

[Download Jquery Snowfall 1.3.1](http://www.somethinghitme.com/wp-content/uploads/2010/11/snowfall.jquery.zip)

**Invoking the snow**

\[sourcecode language="js"\] $(document).snowfall(); $('#elementid').snowfall({flakeCount : 100, maxSpeed : 10}); $('.class').snowfall({flakeCount : 100, maxSpeed : 10}); \[/sourcecode\]

**Snowfall Methods**

\[sourcecode language="js"\] // stopping the snow $(document).snowfall('clear'); $('#elementid').snowfall('clear'); $('.class').snowfall('clear'); \[/sourcecode\]

**Options currently supported with default values**

\[sourcecode language="js"\] options = { flakeCount : 35, // number flakeColor : '#ffffff', // string flakeIndex: 999999, // number minSize : 1, // number maxSize : 3, // number minSpeed : 2, // number maxSpeed : 3 // number }; \[/sourcecode\]

**Example**

<script src="http://www.somethinghitme.com/wp-content/themes/somethinghitme/js/snowfall.min.jquery.js" type="text/javascript"></script>

<script type="text/javascript">// <![CDATA[ $(document).ready(function(){$('#snow-window').snowfall({flakeCount : 100, maxSpeed : 10}); $('#stopsnow').click(function(){ $('#snow-window').snowfall('clear')});}); // ]]></script>
