---
title: "Turning canvas games into executables"
date: "2012-03-29"
teaser: "I wrapped an HTML5 canvas game into a self-contained executable using Qt WebKit and embedded resources so the assets are not exposed. This is the quick write-up of the approach and what I wanted to test next (dependencies and performance)."
---

[![](images/ss1333030211.3125-288x300.png "tetris exe")](http://www.somethinghitme.com/wp-content/uploads/2012/03/ss1333030211.3125.png)

This is something I've been looking to do for the longest time. The closest I ever got was using Adobe Air. I didn't like that solution though because it left all of your assets out in the open. Recently a friend reminded me about [QT](http://qt.nokia.com/products/) something I haven't touched in a few years. After looking over some of their webkit examples I realized I could load in embedded resources.. making self contained canvas games.

I tested out my theory using the Fancy Browser sample, and just modifying it to load an embedded html, which include all the code for the game.

So far it works great. I need to do some more tests, such as finding out what dependencies the executable requires, and also what kind of performance I get (QT5 will include V8). This is still pretty cool in my opinion, just another way to monetize HTML5 games :).... or even... HTML5 screen savers!
