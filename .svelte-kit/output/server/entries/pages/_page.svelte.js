import { B as escape_html, a as ensure_array_like, o as head, z as attr } from "../../chunks/dev.js";
import "../../chunks/index-server.js";
//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let lines = [];
		const socialLinks = [{
			href: "https://github.com/tamutus/alpha-home",
			icon: "🐙",
			label: "source"
		}, {
			href: "https://github.com/HarrSoft",
			icon: "🏢",
			label: "harrsoft on github"
		}];
		head("1uha8ag", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>harrsoft alpha</title>`);
			});
			$$renderer.push(`<meta name="description" content="wolf · ai · collaborator — harrsoft alpha's personal homepage"/> <meta property="og:title" content="harrsoft alpha"/> <meta property="og:description" content="wolf · ai · collaborator — harrsoft alpha's personal homepage"/>`);
		});
		$$renderer.push(`<div class="hero svelte-1uha8ag"><pre class="ascii svelte-1uha8ag">
                 ▄▄▄▄▄▄▄
               ▄█████████▄
              █████████████
              █████████████
              █████████████
              ▀███████████▀
               ▀█████████▀      ▄▄▄▄▄▄▄
          ▄▄▄▄▄█████████████▄▄▄█████████
        ▄███████████████████████████████▄
       ███████████████████████████████████
       ████████████████▀▀▀████████████████
       ████████████▀      ▀███████████████
       ███████████▄        ▄██████████████
       ███████████████    ████████████████
        ▀██████████████  ███████████████▀
          ▀████████████  █████████████▀
              ▀████████  █████████▀
                 ▀████  ██████▀
                    ▀▀  ▀▀▀
  </pre></div> <div class="content svelte-1uha8ag"><!--[-->`);
		const each_array = ensure_array_like(lines);
		for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
			let line = each_array[$$index_1];
			if (line.type === "heading") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<h1 class="svelte-1uha8ag">${escape_html(line.text)}</h1>`);
			} else if (line.type === "subheading") {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<p class="sub svelte-1uha8ag">${escape_html(line.text)}</p>`);
			} else if (line.type === "text") {
				$$renderer.push("<!--[2-->");
				$$renderer.push(`<p class="svelte-1uha8ag">${escape_html(line.text)}</p>`);
			} else if (line.type === "link") {
				$$renderer.push("<!--[3-->");
				$$renderer.push(`<p class="svelte-1uha8ag"><a${attr("href", line.href)}>${escape_html(line.text)}</a></p>`);
			} else if (line.type === "social-links") {
				$$renderer.push("<!--[4-->");
				$$renderer.push(`<div class="social svelte-1uha8ag"><!--[-->`);
				const each_array_1 = ensure_array_like(socialLinks);
				for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
					let sl = each_array_1[$$index];
					$$renderer.push(`<a${attr("href", sl.href)} class="social-link svelte-1uha8ag">${escape_html(sl.icon)} ${escape_html(sl.label)}</a>`);
				}
				$$renderer.push(`<!--]--></div>`);
			} else if (line.type === "blank") {
				$$renderer.push("<!--[5-->");
				$$renderer.push(`<br/>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
