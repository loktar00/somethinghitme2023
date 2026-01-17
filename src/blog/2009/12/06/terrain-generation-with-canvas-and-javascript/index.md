---
title: "Terrain Generation with Canvas and JavaScript"
date: "2009-12-07"
teaser: "The idea of creating height maps with JS and canvas came from an idea I started for a different website I'm developing. This small project has taught me many things (some of the unfortunate things I learned is I still suck at math, and I have many JS skills to brush up on). I just couldn't bring myself to give it up so I also implemented a very slow very light voxel engine..."
---

The idea of creating height maps with JS and canvas came from an  idea I started for a different website I'm developing. This small project has taught me many things (some of the unfortunate things I learned is I still suck at math, and I have many JS skills to brush up on). I just couldn't bring myself to give it up so I also implemented a very slow very light voxel engine.

[You can check out the generator here.](http://www.somethinghitme.com/projects/canvasterrain/) (Chrome recommended, sorry no IE)

The first major thing I learned was the midpoint displacement (or Diamond Square) algorithm. The [Wikipedia article](http://en.wikipedia.org/wiki/Diamond-square_algorithm) and links contained were definitely a great help but this actually took me the longest to implement. Getting the order of  iteration and recursion was the hardest part. I found so many examples but many of them conflicted on actual implementation. The closest example I got working was the example found on [this page](http://www.hyper-metrix.com/processing-js/docs/index.php?page=Plasma%20Fractals) but if you try creating height maps with a lot of noise you will notice square patterns popping up, sometimes with low noise you can catch a nice one right in the center.  This is because they do not take the center into consideration when calculating the edges. I was able to fix this in my version fortunately.

That ended up only being a small part of the project however, you'll notice I added shadow maps which could use some tweaking, and a very slow voxel engine. These sites greatly helped that process.

[http://www.cyberhead.de/download/articles/shadowmap/](http://www.cyberhead.de/download/articles/shadowmap/)

[http://wiki.allegro.cc/index.php?title=Pixelate:Issue\_14/Voxel\_Landscape\_Renderization](http://wiki.allegro.cc/index.php?title=Pixelate:Issue_14/Voxel_Landscape_Renderization)

The last few things to implement are wrapping height maps, and a better color map, and some sort of progress bar. Hopefully after that my obsessions with height maps will be over for a while. These things are pretty addicting, you get such cool results from just a few numbers. Feel free to check out the code, if you have any improvements let me know, I know its by no means even close to perfect. Also if you happen to use it for anything please give credit where its due.

I'll most likely write up yet another midpoint displacement tutorial, because even the current ones left me scratching my head at some points. Then off to working on my canvas zombie game for [zombiegames.net!](http://www.zombiegames.net)

Special thanks to Yutt for testing it out and helping me work on the stupid color bug.
