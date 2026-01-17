---
title: "Dynamic rotated sprite sheets with JavaScript"
date: "2010-02-07"
teaser: "Been working on the single player canvas game this week and got a few cool things accomplished in terms of performance. The main thing I was working on was trying to reduce the slowdown on real time image rotation. What I ended up coming up with was creating rotated sprite sheets on the fly in memory..."
---

Been working on the single player canvas game this week and got a few cool things accomplished in terms of performance. The main thing I was working on was trying to reduce the slowdown on real time image rotation.  What I ended up coming up with was creating rotated sprite sheets on the fly in memory.

The method is pretty simple, here's how it works. I start out with a sprite sheet that contains the characters animation frames all facing on direction. I take that and rotate it in increments of degrees (I chose 23) and render  all of the results to a new sprite sheet in memory. What you end up with is a pretty large sprite sheet of every animation at each angle increment. So instead of 1 line of animation of the character facing upward I now have 16 lines of animations each one facing a different angle. What this allows me to do is take the angle my sprite needs to face, and just go to that section of the sprite sheet for the animations. Doing it this way requires no real time rotation in game. Performance gains were immediately seen. In Chrome I was able to go from 150 zombies on screen (which showed some slowdown) to 800 zombies before any slowdown occurred. In Firefox the results were a little disappointing, I did gain an increase but not much of one.  Take a look for yourself, the first link has 150 zombies using realtime rotation, the 2nd link has pre-rendered rotations with 200 zombies.

[Realtime rotation](http://www.somethinghitme.com/projects/rottest/)

[Pre rotated sprite sheet](http://www.somethinghitme.com/projects/prerotation/)

There is a drawback to this method of course, the main drawbacks are increased load time and higher memory usage.  For me though these do not outweigh the benefit of more on the screen at once at playable frame rates.

[Here's a quick demo](http://www.somethinghitme.com/projects/rotatedimage/rotateImage.html) showing the results of whats going on. It takes a second to load,

And [heres a link to the code](http://www.somethinghitme.com/projects/rotatedimage/rotateImage.js) if anyone is interested. I tied certain numbers to some things that should be variables instead, just note with Firefox you may have issues because getImageData is not always equal to the size of the canvas, which causes errors with putImageData if any data is being put outside the bounds of the canvas object. To fix this I generally add a bit on the width and height of my canvas on creation.
