---
title: "Quick Sort algorithm comparison"
date: "2010-04-21"
teaser: "I've been trying to do regular programming exercises lately just to stay sharp and recently I decided to take on sorting algorithms. I used my current language of choice (javascript) and set out to implement the quick sort algorithm. Below is the portion of my code that completes this..."
tags: "javascript, algorithms, tutorial"
---

I've been trying to do regular programming exercises lately just to stay sharp and recently I decided to take on sorting algorithms. I used my current language of choice (javascript) and set out to implement the [quick sort algorithm](http://en.wikipedia.org/wiki/Quicksort). Below is the portion of my code that completes this.

\[sourcecode language="js"\] sorting.qSort = function (sortItems, \_left, \_right) { var left = \_left, right = \_right, pivot = right;

if(right > left){ do{ // From left for(var i = left; i < pivot; i+=1){ left = i;

if(sortItems\[i\] > sortItems\[pivot\]){ pivot = i; break; } }

// From right for(var i = right; i > pivot; i-=1){ right = i;

if(sortItems\[i\] < sortItems\[pivot\]){ // swap sortItems.swap(i, pivot); pivot = i; break; } } }while((right - left) > 1);

this.qSort(sortItems, \_left , pivot - 1); this.qSort(sortItems, pivot + 1, \_right);

return true; }

return false; } \[/sourcecode\]

The funny thing is really how much quicker this was than the [Bubble sort algorithm](http://en.wikipedia.org/wiki/Bubble_sort). The only benefit I can find to bubble sort is it is much faster to implement

\[sourcecode language="js"\] sorting.bubSort = function (sortItems) { for(var i = 0; i < sortItems.length; i+=1){ if(sortItems\[i\] > sortItems\[i+1\]){ //swap change the incrementor to -1 sortItems.swap(i, i+1); i=-1; } } } \[/sourcecode\]

But like many I recommend you never use it. Using quick sort and sorting 2000 items in random order I get an average of 0.08 with bubble sort this increases to 20 seconds! Also I recommend for javascript using the built in sorting function for arrays the below code beat out my implementation of quick sort everytime with an average speed of 0.01 seconds. Of course its also much easier to implement.

\[sourcecode language="js"\] sorting.internalSort = function sortNumber(a,b){ return a - b; } \[/sourcecode\]

All tests were performed in Chrome. It was a fun exercise overall and helped me brush up on my recursion skills.
