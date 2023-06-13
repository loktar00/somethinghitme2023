---
title: "Javascript Sorting by date time"
date: "2010-04-12"
teaser: "Im currently working on a web based calendar and I needed to sort my event object by date real quick. So the first thing I did was a quick search on sorting an object by date time. Google becomes such second nature I immediately think of doing that first sometimes before fleshing out a whole solution in my mind..."
---

Im currently working on a web based calendar and I needed to sort my event object by date real quick. So the first thing I did was a quick search  on sorting an object by date time. Google becomes such second nature I immediately think of doing that first sometimes before fleshing out a whole solution in my mind. The first result I was brought to was [this page](http://javascript.about.com/library/blsort3.htm) on about.com. While the authors solution will work I thought why do even need this complexity? This is what I came up with when I stepped away from Google realizing this was a very trivial task

\[sourcecode language="js"\]/\* \* Function : sortDate(Date, Date) \* Description : Sorts an object based on date \*/ function sortDate(a,b) { var a = new Date(a.startDateTime), b = new Date(b.startDateTime); return (a.getTime() - b.getTime()); } \[/sourcecode\]

My object has a property called startDateTime, but this can easily be modified. All I do is a quick comparison of the UNIX time stamp and its sorted. Mainly just hoping this eventually ranks higher than the result I found on Google.
