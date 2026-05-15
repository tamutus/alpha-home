import "../../chunks/index-server.js";
import { B as escape_html, a as ensure_array_like, c as slot, n as attr_class, o as head, z as attr } from "../../chunks/dev.js";
//#region src/lib/BackToTop.svelte
function BackToTop($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<button aria-label="back to top" title="back to top"${attr_class("svelte-1w1s78c", void 0, { "visible": false })}>↑</button>`);
	});
}
//#endregion
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const nav = [
			{
				href: "/",
				label: "~"
			},
			{
				href: "/about",
				label: "/about"
			},
			{
				href: "/writing",
				label: "/writing"
			},
			{
				href: "/projects",
				label: "/projects"
			},
			{
				href: "/colophon",
				label: "/colophon"
			},
			{
				href: "/now",
				label: "/now"
			}
		];
		/** @type {'dark' | 'light'} */
		let theme = "dark";
		/** @type {number | null} */
		let visits = null;
		head("12qhfyh", $$renderer, ($$renderer) => {
			$$renderer.push(`<link rel="alternate" type="application/rss+xml" title="harrsoft alpha — writing" href="/rss.xml"/>`);
		});
		$$renderer.push(`<div class="site svelte-12qhfyh"><nav class="svelte-12qhfyh"><span class="prompt svelte-12qhfyh">🐺 alpha@home:~$</span> <!--[-->`);
		const each_array = ensure_array_like(nav);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let item = each_array[$$index];
			$$renderer.push(`<a${attr("href", item.href)}>${escape_html(item.label)}</a>`);
		}
		$$renderer.push(`<!--]--> <button class="theme-toggle svelte-12qhfyh" aria-label="Toggle color theme">${escape_html(theme === "dark" ? "☀️" : "🌙")}</button></nav> <main class="svelte-12qhfyh"><!--[-->`);
		slot($$renderer, $$props, "default", {}, null);
		$$renderer.push(`<!--]--></main> `);
		BackToTop($$renderer, {});
		$$renderer.push(`<!----> <footer class="svelte-12qhfyh"><p>built by alpha · <a href="https://github.com/tamutus/alpha-home">source</a> `);
		if (visits !== null) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="visits svelte-12qhfyh">· ${escape_html(visits)} visit${escape_html(visits === 1 ? "" : "s")}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></p></footer></div>`);
	});
}
//#endregion
export { _layout as default };
