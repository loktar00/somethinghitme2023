---
title: "Rainbow bright bookmarklet"
date: "2013-01-03"
teaser: "A bookmarklet that cycles colors across every element on the page. Drag it to your bookmarks, click it on any site, and enjoy the chaos..."
---

Went a little crazy with a friend of mines bookmarklet he made that would randomly change the colors of all elements on a page.

\[gist id=4445115\]

Just drag this link to your bookmarks and click it on any random page to enjoy the show

<a href="javascript:function c(){return Math.floor(255*Math.random())}function g(){var a=parseFloat(this.dataset.d);isNaN(a)&&(a=~~(100*Math.random()));with(this.style){var d=rgb((d{1,3}), (d{1,3}), (d{1,3}))/,b=d.exec(color),e={c:c(),b:c(),a:c()},f={c:c(),b:c(),a:c()};null!==b&&(e={c:b[1],b:b[2],a:b[3]});b=d.exec(backgroundColor);null!==b&&(f={c:b[1],b:b[2],a:b[3]});a+=0.5;100<a&&(a=0);cCycle=a+50;100<cCycle&&(cCycle-=100);h(e,cCycle);h(f,a);color='rgb('+e.c+','+e.b+','+e.a+')';backgroundColor='rgb('+f.c+','+f.b+','+f.a+')'}this.dataset.d=a}function j(){Array.prototype.forEach.call(document.all,function(a){setTimeout(function(){g.call(a)},10)});setTimeout(j,10)}function h(a,d){a.c=~~(127*Math.sin(0.3*d+0)+128);a.b=~~(127*Math.sin(0.3*d+2)+128);a.a=~~(127*Math.sin(0.3*d+4)+128)}j()">Bookmarklet</a>
