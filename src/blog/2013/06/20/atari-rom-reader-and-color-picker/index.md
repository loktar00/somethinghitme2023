---
title: "Atari Rom Reader, and color picker"
date: "2013-06-20"
coverImage: "atari_7800_prosystem_by_computergenius-d38gkld.png"
teaser: "Step into the world of Atari 7800 roms as the I share an intriguing project that dumps and displays the data of these roms using the canvas element. Discover the simplicity and efficiency of extracting graphics from Atari games through this application. Dive into the technical aspects of decoding roms, understanding graphic modes, and extracting color information. Explore the results and gain insights into the my journey in creating this tool."
---

Wanted to share an interesting yet simple project I created the other day. It simply dumps Atari 7800 roms and displays the data via canvas. I've wanted to create a few 7800 games for a long time, but playing the games and taking screenshots to remove sprites takes forever, so I made a simple application to do it for me (for the most part anyway).

[![7800 Asteroids Rip](images/asteroids.png)](http://www.somethinghitme.com/wp-content/uploads/2013/06/asteroids.png)

This is the result of decoding the asteroids rom for the 7800.

[Atari Rom Display](http://loktar00.github.io/AtariRomDisplay/)

[Source](https://github.com/loktar00/AtariRomDisplay) for anyone who is interested

It was actually pretty simple to do, first what I did was read up on the 7800 spec and different graphic modes it supports. I found that 160A was the mode used by most 7800 games.  In 160a mode the sprites can have 3 colors , which are represented by a pair of bits.

00 = Background
01 = Color 1
11 = Color 2
10 = Color 3

So what I do is go through the entire rom and check the pair of bits and then draw that to the screen. Also since apparently it was faster, the graphics are stored upside down so I read the rom data in reverse order. I used AngularJS for the application as well just to get my feet with it, and created my own [polyfill](https://github.com/loktar00/PolyPicker) for the color picker inputs, which I might post about later once its a bit more feature complete.
