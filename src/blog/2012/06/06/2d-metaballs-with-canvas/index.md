---
title: "2d Metaballs with canvas!"
date: "2012-06-07"
coverImage: "metafeat.png"
teaser: "I recreated the metaballs effect in JavaScript canvas using radial gradients and an alpha threshold. This post walks through the approach, includes the gists, and links a demo and JSFiddle to play with."
tags: "javascript, canvas, graphics, tutorial"
---

I read this [great article](http://nullcandy.com/2d-metaballs-in-xna/) on creating 2d metaballs with XNA. I never really looked into the concept behind them, but after reading that they seemed pretty simple. I decided to try my hand at it using javascript and canvas. The results were pretty awesome (well in my opinion anyway).

**Quick attempt at explaining my understanding at metaballs without butchering them**

The basic concept is to use a radial gradient, and set an alpha threshold that will be filtered. For example any pixel with an alpha lower than 150 will be set to an alpha of 0. This gives the metaball effect because when the gradients overlap, the areas that are normally hidden now have their alpha values added which brings them above the threshold.

**One way to achieve this using canvas and javascript**

So basically what I do is create a bunch of points, and set their velocities, positions and sizes.

\[gist id=2885768\]

Next I draw each of these onto a temp canvas

\[gist id=2885774\]

Then finally I read the pixel data, filter the alpha based on a threshold I set, and put the filtered data back onto the main canvas to be displayed.

\[gist id=2885780\]

[Check out the demo with added features](http://somethinghitme.com/projects/metaballs/) or the [jsfiddle](http://jsfiddle.net/loktar/TscNZ/) to play around with.
