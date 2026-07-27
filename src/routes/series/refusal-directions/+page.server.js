import refusalDirections from '../../../../data/refusal-directions.json' with { type: 'json' };

/** @type {import('./$types').PageServerLoad} */
export function load() {
  return refusalDirections;
}
