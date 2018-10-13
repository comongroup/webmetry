import get from 'lodash/get';
import ComponentRepository from './io/ComponentRepository';
import exportJSONFromInspector from './io/exportJSONFromInspector';
import importJSONToInspector from './io/importJSONToInspector';

const repo = new ComponentRepository();
const actions = {
	'import': {
		'json': importJSONToInspector
	},
	'export': {
		'json': exportJSONFromInspector
	}
};

export function mapIO(action, source) {
	return { action, source };
}

export function performInspectorIO(inspector, { action, source }) {
	const method = get(actions, `${action}.${source}`);
	if (method && typeof method === 'function') {
		method(inspector, repo);
	}
}

export { repo };
