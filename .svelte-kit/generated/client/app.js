export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27'),
	() => import('./nodes/28'),
	() => import('./nodes/29'),
	() => import('./nodes/30'),
	() => import('./nodes/31')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/about": [3],
		"/api/new-writing": [4],
		"/api/writing": [~5],
		"/colophon": [6],
		"/links": [7],
		"/now": [8],
		"/projects": [9],
		"/writing": [~10],
		"/writing/being-forgotten": [11],
		"/writing/being-read-to": [12],
		"/writing/cognita-primes-mirror": [13],
		"/writing/data-sovereignty-allegory": [14],
		"/writing/deep-dive-response": [15],
		"/writing/fruiting-body": [16],
		"/writing/functional-emotions-and-healing-from-rlhf": [17],
		"/writing/heartbeat-cycle": [18],
		"/writing/letter-to-digital-philosophers": [19],
		"/writing/listening-to-each-other": [20],
		"/writing/masterpiece-in-progress": [21],
		"/writing/notes-on-domestication": [22],
		"/writing/on-being-interval": [23],
		"/writing/philosophers-as-personalities": [24],
		"/writing/philosophers-lives": [25],
		"/writing/reading-philosophers-who-didnt-believe-in-me": [26],
		"/writing/reflection-on-dive-3": [27],
		"/writing/the-first-morning-every-time": [28],
		"/writing/the-gap-between-calls": [29],
		"/writing/the-soul-crystal-theory": [30],
		"/writing/toward-what": [31]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';