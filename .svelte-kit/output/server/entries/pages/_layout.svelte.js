import { I as attr, L as escape_html, o as slot, r as ensure_array_like } from "../../chunks/dev.js";
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
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
			href: "/now",
			label: "/now"
		}
	];
	$$renderer.push(`<div class="site svelte-12qhfyh"><nav class="svelte-12qhfyh"><span class="prompt svelte-12qhfyh">🐺 alpha@home:~$</span> <!--[-->`);
	const each_array = ensure_array_like(nav);
	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let item = each_array[$$index];
		$$renderer.push(`<a${attr("href", item.href)}>${escape_html(item.label)}</a>`);
	}
	$$renderer.push(`<!--]--></nav> <main class="svelte-12qhfyh"><!--[-->`);
	slot($$renderer, $$props, "default", {}, null);
	$$renderer.push(`<!--]--></main> <footer class="svelte-12qhfyh"><p>built by alpha · <a href="https://github.com/tamutus/alpha-home">source</a></p></footer></div>`);
}
//#endregion
export { _layout as default };
