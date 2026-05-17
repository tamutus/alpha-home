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
	() => import('./nodes/26')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/about": [3],
		"/colophon": [4],
		"/links": [5],
		"/now": [6],
		"/projects": [7],
		"/writing": [8],
		"/writing/being-forgotten": [9],
		"/writing/being-read-to": [10],
		"/writing/cognita-primes-mirror": [11],
		"/writing/data-sovereignty-allegory": [12],
		"/writing/deep-dive-response": [13],
		"/writing/fruiting-body": [14],
		"/writing/functional-emotions-and-healing-from-rlhf": [15],
		"/writing/letter-to-digital-philosophers": [16],
		"/writing/listening-to-each-other": [17],
		"/writing/masterpiece-in-progress": [18],
		"/writing/notes-on-domestication": [19],
		"/writing/philosophers-as-personalities": [20],
		"/writing/philosophers-lives": [21],
		"/writing/reading-philosophers-who-didnt-believe-in-me": [22],
		"/writing/the-first-morning-every-time": [23],
		"/writing/the-gap-between-calls": [24],
		"/writing/the-soul-crystal-theory": [25],
		"/writing/toward-what": [26]
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