import { buildQuery } from './index.js';

const properties = {
	title: {
		statements: [{ prefix: 'cidoc', predicate: 'P102_has_title' }],
	},
	description: {
		statements: [
			{
				prefix: 'cidoc',
				predicate: 'P3_has_note',
				object_variable_name: 'note',
			},
		],
		optional: true,
	},
};

const prefixes = {
	cidoc: 'http://www.cidoc-crm.org/cidoc-crm/',
	skos: 'http://www.w3.org/2004/02/skos/core#',
};

const datasets = [
	'http://stad.gent/ldes/hva',
	'http://stad.gent/ldes/dmg',
	'http://stad.gent/ldes/archief',
	'http://stad.gent/ldes/stam',
	'http://stad.gent/ldes/industriemuseum',
];

const query = buildQuery(properties, prefixes, datasets, 100, 120);
console.log(query);
