---
title: "Snowfall Plugin Updated"
date: "2009-12-21"
teaser: "Updated the snowfall plugin that was released yesterday with a few more features. The primary new feature allows you to specify which elements you want the snow to appear in. An example of this can be seen below. View a full page demonstration. In addition to snowing within elements there are some more options available, properties available are..."
---

Updated the [snowfall plugin](http://www.somethinghitme.com/wp-content/uploads/2009/12/snowfall.jquery.zip) that was released yesterday with a few more features.  The primary new feature allows you to specify which elements you want the snow to appear in. An example of this can be seen below. [View a full page demonstration](http://www.zombietweets.com)

`$('#snow-window').snowfall({flakeCount : 100, maxSpeed : 10});`

In addition to snowing within elements there are some more options available, properties available are

`flakeCount, flakeColor, flakeIndex, minSize, maxSize, minSpeed, maxSpeed`

You can still initialize the plugin with

`$(document).snowfall();`

but the flakes will not use fixed for positioning, they will now travel down the page completely. On some long pages this will make it seem like its not "snowing" as much. I'm working on a few more updates that should be released in the following days. If you end up using this I'd love to know. You can download the most recent version [here](http://www.somethinghitme.com/wp-content/uploads/2009/12/snowfall.jquery.zip).

<script src="http://www.somethinghitme.com/wp-content/themes/somethinghitme/js/snowfall.jquery.js" type="text/javascript"></script>

<script type="text/javascript">$('#snow-window').snowfall({flakeCount : 100, maxSpeed : 10});</script>
