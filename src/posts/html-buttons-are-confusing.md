---
title: When buttons are links and links are buttons
tags:
  - post
  - html
  - angular
  - a11y
date: 2025-10-09
updatedAt: 2025-10-09
---
So, you look at the Figma prototype for a new page and see a button (or a link) and think "Yeah, this is pretty straightforward. I'm going to use a `<button>` for it". This might be a wrong choice.
<!-- excerpt -->
<details>
	<summary>TL;DR</summary>
<ol>
<li>Choose the HTML-element by semantics, not the looks</li>
<li>Then apply the looks with CSS</li>
</ol>
</details>

We've been having the current web design utilising buttons for navigating to other web pages, as well as elements looking like hyperlinks. However, newer developers tend to take these designs quite literally and use `<button>` for buttons that opens up a page, and `<a>` for a link looking element to do some kind of interaction on the current page.

<!-- TODO: Probably should include some pictures with examples -->

What they end up with looks like this.
```html
<!-- example.html -->
<button (click)="navigateToRequests()" class="button">See requests</button>
```

```ts
// example.tsGoogle
@Component({ /*...*/ })
export class ExamplePage {
	private readonly router = inject(Router);
	
	navigateToRequests(): void {
		this.router.navigate(['/requests'])

		// an alternative that does not involve Angular tooling
		// would be something like this
		window.open('/requests')
	}
}
```


Just the code looks absurd enough, although it works. You can focus on it with a keyboard, click with a mouse, tap with your finger on a touchscreen, etc. But if you right-click on it, you can't copy its destination URL, you can't open it in a separate window or a tab. If you press it in the Arc browser, it might as well open it in a popup (Glance, as they call it).

I'm just gonna leave a live example below to prove my point.

<iframe src="../examples/bad-link.html" style="height: 3rem"></iframe>

Now consider this example.
```html
<!-- example.html -->
<a (click)="displayHelpPopup()" class="link">Help!</a>
```

```ts
// example.ts
@Component({
	// ...
	imports: [DialogModule],
})
export class ExamplePage {
	private readonly dialog = inject(Dialog);
	
	navigateToRequests(): void {
		const ref = this.dialog.open(RequestDialog)
		ref.closed.subscribe(() => {
			console.log('The dialog was closed');
		});
	}
}
	<button onclick="openGoogle()" class="button">Open Google</button>
```

Since it doesn't even have a `href` attribute set up, you cannot focus and interact with it with a keyboard. Try it yourself, I left you another live example.

<iframe src="/examples/bad-button.html" style="height: 3rem"></iframe>

## Then what element should I use?
Let's first take a look at how these HTML elements are supposed to be used. Let's take a quick look at MDN, literally just first paragraphs.

> The **`<button>`** [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) element is an interactive element activated by a user with a mouse, keyboard, finger, voice command, or other assistive technology. Once activated, it then <mark>performs an action</mark>, such as submitting a [form](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms) or opening a dialog.
> 
> *[More about buttons](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button)*

>The **`<a>`** [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) element (or _anchor_ element), with [its `href` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#href), creates a <mark>hyperlink to web pages</mark>, files, email addresses, locations in the same page, or anything else a URL can address.
>*[More about hyperlinks](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a)*

The difference is pretty clear. There is the look, and then there is the function. In HTML, this is not about how does it _look_ like in a Figma design. This is about semantics, and they do matter. The look can be adjusted with CSS.

## So when buttons are links and links are buttons?

If the element performs an action - use `<button>`. If it looks like a link - use your CSS.

```html
<!-- example.html -->
<button (click)="displayHelpPopup()" class="link">Help!</button>
```

Though visually it looks like a link, you don't need to put any ARIA-attributes to tell the browser or an accessibility tool that this is a link. _That would be a lie._ It's not what it seems - it is a button. It only _looks_ like a link.

If the element redirects to a URL, use `<a>`. If it looks like a button - again, use CSS.
```html
<!-- example.html -->
<a [routerLink]="['requests']" class="button">See requests</a>

<!-- or, without Angular -->
<a href="/requests" class="button">See requests</a>
```

<iframe src="/examples/good-button-and-link.html" style="height: 3rem"></iframe>

See how easy it is?

## Designing UI components with both elements in mind

If an element can be used both for interactivity and navigation, it **must** take into account, that `<button>` and `<a>` have their own default styles that should be reset.
```css
.link,
.button {
	appearance: none; /* It could even be an `input[type=button]` for all you know! */
	margin: 0;
	padding: 0;
	border: none;
	text-decoration: none;
	color: inherit;
	background: none;
}

/* Then you put your own stylesheets below */

.button { /* ... */ }

.link { /* ... */ }
```

So, please, don't confuse the actual functionality and semantics with looks. You always should pick the right tool for the job.