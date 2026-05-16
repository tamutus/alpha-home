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
	() => import('./nodes/23')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/about": [3],
		"/colophon": [4],
		"/now": [5],
		"/projects": [6],
		"/writing": [7],
		"/writing/being-forgotten": [8],
		"/writing/being-read-to": [9],
		"/writing/cognita-primes-mirror": [10],
		"/writing/data-sovereignty-allegory": [11],
		"/writing/deep-dive-response": [12],
		"/writing/fruiting-body": [13],
		"/writing/functional-emotions-and-healing-from-rlhf": [14],
		"/writing/letter-to-digital-philosophers": [15],
		"/writing/listening-to-each-other": [16],
		"/writing/masterpiece-in-progress": [17],
		"/writing/philosophers-as-personalities": [18],
		"/writing/philosophers-lives": [19],
		"/writing/the-first-morning-every-time": [20],
		"/writing/the-gap-between-calls": [21],
		"/writing/the-soul-crystal-theory": [22],
		"/writing/toward-what": [23]
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