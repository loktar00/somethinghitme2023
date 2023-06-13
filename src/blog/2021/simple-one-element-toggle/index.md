---
title: "Simple One Element Toggle"
date: "2021-10-23"
teaser: "Dive into a quick toggle implementation using pure CSS and a single HTML element. Witness the magic of CSS as it brings the toggle to life with smooth transitions and dynamic styling. Explore the simplicity and versatility of this toggle design, making it a convenient choice for projects where minimalism and efficiency are paramount."
---

<iframe height="300" style="width: 100%;" scrolling="no" title="Simple 1 element CSS toggle" src="https://codepen.io/loktar00/embed/RwZpBab?default-tab=css%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/loktar00/pen/RwZpBab">
  Simple 1 element CSS toggle</a> by Loktar (<a href="https://codepen.io/loktar00">@loktar00</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

Needed a pretty quick toggle for a project I was working on, definitely could have copied one of the hundreds of toggles out there that exist, but what's the fun in that?

The main purpose was to allow it to be used as a checkbox with a single element rquiring no extra elements or correct placement of container or child elements.

```html
<input type="checkbox" class="toggle">
```

All of the magic is of course in the CSS.

```css
.toggle {
  --size: 1.125rem;
  --width: calc(1.125rem * 2);
  display: inline-grid;
  align-items: center;
  width: var(--width);
  height: var(--size);
  cursor: pointer;
}

.toggle::before {
  content: "";
  grid-area: 1 / -1;
  width: var(--width);
  height: var(--size);
  transition: all 250ms ease;
  border-radius: var(--width);
  background-color: #000;
}

.toggle:hover::before {
  box-shadow: 0 0 0 2px #aef;
}

.toggle::after {
  content: "";
  grid-area: 1 / -1;
  width: calc(var(--size) * 0.8);
  height: calc(var(--size) * 0.8);
  transform: translateX(10%);
  transform-origin: center center;
  transition: all 250ms ease;
  border-radius: 100%;
  background: #fff;
}

.toggle:checked::before {
  background-color: #2be;
}

.toggle:checked::after {
   transform: translateX(calc(var(--width) - var(--size) * 0.8 - 10%));
}

.toggle:disabled {
  pointer-events: none;
  filter: grayscale(1);
}

.toggle:disabled::before {
   background: #2be;
}

```