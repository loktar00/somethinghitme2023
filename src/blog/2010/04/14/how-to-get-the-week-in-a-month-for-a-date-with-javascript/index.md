---
title: "How to get the week in a month for a date with Javascript"
date: "2010-04-14"
teaser: "Working on my calendar application and I needed to get what week in the current month a day occurs on. Unfortunately I couldn't find anything like this in the JavaScript Date object so this is the function I came up with..."
tags: "javascript, tutorial"
---

Working on my calendar application and I needed to get what week in the current month a day occurs on. Unfortunately I couldn't find anything like this in the JavaScript Date object so this is the function I came up with

\[sourcecode language="js"\] Date.prototype.getMonthWeek = function(){ var firstDay = new Date(this.getFullYear(), this.getMonth(), 1).getDay(); return Math.ceil((this.getDate() + firstDay)/7); } \[/sourcecode\]

Thanks to mutilator for helping out with the actual math to figure it out.
