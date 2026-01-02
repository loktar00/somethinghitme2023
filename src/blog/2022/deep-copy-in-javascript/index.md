---
title: "Deep copying in JavaScript"
date: "2022-04-27"
teaser: "Deep copying in JavaScript is a mess if you do not know the tradeoffs. This post covers shallow vs deep copies, where JSON stringify and spread/Object.assign break down, and when structuredClone is the right tool."
---

## Deep copying / cloning in JavaScript

**tldr; structuredClone**

### Copying by value or reference

Before we talk about deep cloning let's take a step back and talk about passing by value or by reference. Quick explanation, copying by value assigns the data to a new memory address, whereas copying by reference just points to the memory address which has the original value.

**Example of a primitive type in JavaScript being copied by value:**

```javascript
let a = 'Hello!';
const b = a;

a = 'Bye!'

console.log(b) // Hello!
```

Primitive types copied by value:  string, number, boolean, undefined, null,

**Example of a type being copied by reference:**

```javascript
let a = [1, 2, 3, 4];
const b = a;

a[0] = 'first index in the array!';

console.log(b) // ['first index in the array!', 2, 3, 4]

let foo = { prop: 123 };
let bar = foo;

foo.prop = 456;

console.log(bar); // 456
```

The above will happen with object, array, and function

## Deep copying in JS only skin deep

JavaScript will only naturally deep copy 1 level deep, and only the primitive types mentioned above.

**Deep copy, by value when one level deep:**

```javascript
let a = [1, 2, 3, 4];

// a.map(el => el), a.forEach(el => b.push(el));
const b = [...a];

a[0] = 'first index in the array!';

console.log(b) // ['first index in the array!', 2, 3, 4]

let foo = {prop: 123};
let bar = {...foo}; //Object.assign({}, foo);

foo.prop = 456;

console.log(bar); // {prop: 123}
```

For example an array one level deep containing objects property will still be shallow copies.

**Shallow copy once we introduce objects:**

```javascript
let a = [{a:1}, {b:2}, {c:3}];
const b = [...a]; // a.map(el => el);

a[0].a = 'first index in the array!';

// [{"a":"first index in the array!"}, {"b":2}, {"c":3}]
console.log(b)
```

This means once our data structure introduces any nesting (arrays, objects or functions) we're back to a shallow copy of the data.

**Shallow copy once we introduce nested value:**

```javascript
let a = [[1, 2, 3], 2, 3];
const b = [...a];

a[0][0] = 'first index in the array!';

// [["first index in the array!", 2, 3], 2, 3]
console.log(JSON.stringify(b))
```

### How can we fix this?

So now that we've established how it works what can we do about it?

You'll find various solutions online from over the years, solutions which include recursively traversing the data structures and copying each element such as below just for this demo. While they work they're not always performant and commonly have issues.

**Random utility to deep copy an array:**

```javascript
// Don't use this!
function deepCopy(arr, result) {
  for (let el of arr) {
    if (Array.isArray(el)) {
      result.push(deepCopy(el, []));
    } else {
      result.push(el);
    }
  }

  return result;
}

let a = [[7, 8, 9, [10, 11]], 2, 3];
const b = [...a];
const c = deepCopy(a, []);

a[0][0] = 'first index in the array!';
console.log(b); // [["first index in the array!",8,9,[10,11]],2,3]
console.log(c); // [[7,8,9,[10,11]],2,3]
```

### JSON.stringify to the rescue?

What if we could type cast all of our values to a string and read them back in? That’s exactly what JSON.stringify does for us. It's become the defacto method of deep copying.. so much in fact browser vendors have spent extra time making it more performant over the years.

```javascript
let a = [[7, 8, 9, [10, 11]], 2, 3];
const b = [...a];
const c = JSON.parse(JSON.stringify(a));

a[0][0] = 'first index in the array!';
console.log(b); // [["first index in the array!",8,9,[10,11]],2,3]
console.log(c); // [[7,8,9,[10,11]],2,3]
```

It works, we're done!... well not so fast. The JSON.stringify method while fast and gets us most of the way there still has some pretty significant drawbacks.

**Example using a Map and Date**

```javascript
const map = new Map();
map.set('a', 1);

let date = new Date();

let a = [0, 1, {c: map}, date];
// [0, 1, {c:{}}, '2022-04-07T22:15:09.947Z']
const b = JSON.parse(JSON.stringify(a));
```

Notice how our Map is now just an empty object, in addition since the data is "stringified" and parsed we get the actual value for Date rather than access to the date object itself. This also of course applies to Set, and regex values as well.

### Introducing structuredClone() to the rescue (mostly)

[Usage from MDN.](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone#syntax)

```javascript
structuredClone(value)
structuredClone(value, { transfer })
```

This simplifies almost everything for us.

**The same example from above with structuredClone:**

```javascript
const map = new Map();
map.set('a', 1);

let date = new Date();

let a = [0, 1, {c: map}, date];
const b = JSON.parse(JSON.stringify(a));
const c = structuredClone(a);
a[1] = 2;

// [0, 1, {c:{}}, '2022-04-07T22:15:09.947Z']
console.log(b);

// [0, 1,
//  {{c: Map(1)},
//  Thu Apr 07 2022 18:15:17 GMT-0400 (Eastern Daylight Time)
// ]

console.log(c);

c[3].getDate() + 5 // Current date + 5 returns the result

// Can't do this since it's just a string.
// Uncaught TypeError: b[3].getDate is not a function
b[3].getDate() + 5
```

### Caveats of structuredClone
There's only one real issue currently that affects all the methods above, functions and dom elements.

Functions error

```javascript
let a = [0, 1, {c: () => true} ];
// Uncaught DOMException:
// Failed to execute 'structuredClone' on 'Window'
const c = structuredClone(a);
```

As long as you’re aware of the caveats (which are generally small edge cases in our data) structuredClone is the recommended approach for deep copying data within JavaScript. It’s a first class citizen and removes some hacks and using JSON parsing which has always felt like a hack.

I definitely recommend reading the link above to [2ality](https://2ality.com/2022/01/structured-clone.html) on further caveats and a fantastic in depth description into structuredClone which goes much further than the MDN article.