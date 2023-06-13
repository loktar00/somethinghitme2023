---
title: "JavaScript time between dates"
date: "2010-09-21"
teaser: "A person asked a question in my post about sorting dates in Javascript, basically on how to return a measurement of time between dates, such as days, hours, minutes, seconds. I haven't really ever had to do something like this so I figured I would see if it was as easy as I assumed it would be in JS..."
---

A person asked a question in my [post about sorting dates in Javascript](http://www.somethinghitme.com/2010/04/12/javascript-sorting-by-date-time/), basically on how to return a measurement of time between dates, such as days, hours, minutes, seconds. I haven't really ever had to do something like this so I figured I would see if it was as easy as I assumed it would be in JS. This is what I came up with.

\[sourcecode language="js"\] var dob = new Date("9/28/1982"), today = new Date("9/21/2010");

// Days between dates alert((today-dob)/86400000);

// Years between dates alert(((today-dob)/86400000)/365); \[/sourcecode\]

Returns pretty accurate results, Im not accounting for leap years so it thinks I'm already 28 even though I still have a few days to go.
