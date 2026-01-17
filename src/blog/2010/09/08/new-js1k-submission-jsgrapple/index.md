---
title: "New js1k Submission JSGrapple"
date: "2010-09-08"
teaser: "Update Submission for the js1k competition. My 3rd, and final one only the last one you enter is judged and I think this is going to be as good as it gets from me that is. I ended up settling on a clone of a cool game I used to play when I was a network admin in the Air Force called Wire Hang Redux..."
tags: "javascript, canvas, game development"
---

[Update Submission](http://js1k.com/demo/755) for the [js1k](js1k.com) competition. My 3rd, and final one only the last one you enter is judged and I think this is going to be as good as it gets from me that is. I ended up settling on a clone of a cool game I used to play when I was a network admin in the Air Force called [Wire Hang Redux](http://www.gingerbeardman.com/wirehang/).

This entry was more of a challenge than my [previous one](http://js1k.com/demo/591), I had to not only make it look presentable but also had to worry about game play, simple physics, and of course lack of bugs. I think it turned out pretty well, and I owe a big thanks to the Google Closure Compiler, it definitely made things easier. The biggest challenge was trying to decide on what features to add. I had a choice between keeping the high score and allowing users to try again (without refresh) , or the option of making it harder the higher they go. I chose the latter which I think was a good decision.

Some things I learned from the contest,

- pre calculated values use much less space, (.017 uses much less space than pi/180)
- There are shorter ways to get an element through the dom than getElementById
- You can make something cool and fun in 1k using Javascript

I think the next thing I will do is make a bigger/better/cooler version.

Now just imagine if I had 640k to work with!

<canvas id="c" width="256" height="512"></canvas>
<script type="text/javascript" src="/2010/09/08/new-js1k-submission-jsgrapple/js/grapple.js"></script>