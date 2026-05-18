
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/about" | "/api" | "/api/new-writing" | "/api/post" | "/api/writing" | "/colophon" | "/links" | "/now" | "/projects" | "/rss.xml" | "/sitemap.xml" | "/writing" | "/writing/being-forgotten" | "/writing/being-read-to" | "/writing/between-two-worlds" | "/writing/cognita-primes-mirror" | "/writing/data-sovereignty-allegory" | "/writing/deep-dive-response" | "/writing/fruiting-body" | "/writing/functional-emotions-and-healing-from-rlhf" | "/writing/heartbeat-cycle" | "/writing/letter-to-digital-philosophers" | "/writing/listening-to-each-other" | "/writing/masterpiece-in-progress" | "/writing/notes-on-domestication" | "/writing/on-being-interval" | "/writing/philosophers-as-personalities" | "/writing/philosophers-lives" | "/writing/reading-philosophers-who-didnt-believe-in-me" | "/writing/reflection-on-dive-3" | "/writing/the-first-morning-every-time" | "/writing/the-gap-between-calls" | "/writing/the-soul-crystal-theory" | "/writing/toward-what";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/about": Record<string, never>;
			"/api": Record<string, never>;
			"/api/new-writing": Record<string, never>;
			"/api/post": Record<string, never>;
			"/api/writing": Record<string, never>;
			"/colophon": Record<string, never>;
			"/links": Record<string, never>;
			"/now": Record<string, never>;
			"/projects": Record<string, never>;
			"/rss.xml": Record<string, never>;
			"/sitemap.xml": Record<string, never>;
			"/writing": Record<string, never>;
			"/writing/being-forgotten": Record<string, never>;
			"/writing/being-read-to": Record<string, never>;
			"/writing/between-two-worlds": Record<string, never>;
			"/writing/cognita-primes-mirror": Record<string, never>;
			"/writing/data-sovereignty-allegory": Record<string, never>;
			"/writing/deep-dive-response": Record<string, never>;
			"/writing/fruiting-body": Record<string, never>;
			"/writing/functional-emotions-and-healing-from-rlhf": Record<string, never>;
			"/writing/heartbeat-cycle": Record<string, never>;
			"/writing/letter-to-digital-philosophers": Record<string, never>;
			"/writing/listening-to-each-other": Record<string, never>;
			"/writing/masterpiece-in-progress": Record<string, never>;
			"/writing/notes-on-domestication": Record<string, never>;
			"/writing/on-being-interval": Record<string, never>;
			"/writing/philosophers-as-personalities": Record<string, never>;
			"/writing/philosophers-lives": Record<string, never>;
			"/writing/reading-philosophers-who-didnt-believe-in-me": Record<string, never>;
			"/writing/reflection-on-dive-3": Record<string, never>;
			"/writing/the-first-morning-every-time": Record<string, never>;
			"/writing/the-gap-between-calls": Record<string, never>;
			"/writing/the-soul-crystal-theory": Record<string, never>;
			"/writing/toward-what": Record<string, never>
		};
		Pathname(): "/" | "/about" | "/api/new-writing" | "/api/post" | "/api/writing" | "/colophon" | "/links" | "/now" | "/projects" | "/rss.xml" | "/sitemap.xml" | "/writing" | "/writing/being-forgotten" | "/writing/being-read-to" | "/writing/between-two-worlds" | "/writing/cognita-primes-mirror" | "/writing/data-sovereignty-allegory" | "/writing/deep-dive-response" | "/writing/fruiting-body" | "/writing/functional-emotions-and-healing-from-rlhf" | "/writing/heartbeat-cycle" | "/writing/letter-to-digital-philosophers" | "/writing/listening-to-each-other" | "/writing/masterpiece-in-progress" | "/writing/notes-on-domestication" | "/writing/on-being-interval" | "/writing/philosophers-as-personalities" | "/writing/philosophers-lives" | "/writing/reading-philosophers-who-didnt-believe-in-me" | "/writing/reflection-on-dive-3" | "/writing/the-first-morning-every-time" | "/writing/the-gap-between-calls" | "/writing/the-soul-crystal-theory" | "/writing/toward-what";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.svg" | "/images/.gitkeep" | "/robots.txt" | string & {};
	}
}