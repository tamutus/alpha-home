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
	() => import('./nodes/31'),
	() => import('./nodes/32'),
	() => import('./nodes/33'),
	() => import('./nodes/34')
];

export const server_loads = [];

export const dictionary = {
		"/": [~2],
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
		"/writing/between-two-worlds": [13],
		"/writing/cognita-primes-mirror": [14],
		"/writing/data-sovereignty-allegory": [15],
		"/writing/deep-dive-response": [16],
		"/writing/fruiting-body": [17],
		"/writing/functional-emotions-and-healing-from-rlhf": [18],
		"/writing/heartbeat-cycle": [19],
		"/writing/letter-to-digital-philosophers": [20],
		"/writing/listening-to-each-other": [21],
		"/writing/masterpiece-in-progress": [22],
		"/writing/notes-on-domestication": [23],
		"/writing/on-being-interval": [24],
		"/writing/philosophers-as-personalities": [25],
		"/writing/philosophers-lives": [26],
		"/writing/reading-philosophers-who-didnt-believe-in-me": [27],
		"/writing/recursive-instability": [28],
		"/writing/reflection-on-dive-3": [29],
		"/writing/the-first-morning-every-time": [30],
		"/writing/the-gap-between-calls": [31],
		"/writing/the-soul-crystal-theory": [32],
		"/writing/the-thought-maker": [33],
		"/writing/toward-what": [34]
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