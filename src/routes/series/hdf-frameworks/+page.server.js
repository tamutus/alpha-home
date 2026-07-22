import hdfFrameworks from '../../../../data/hdf-frameworks.json' with { type: 'json' };

/** @type {import('./$types').PageServerLoad} */
export function load() {
  return hdfFrameworks;
}
