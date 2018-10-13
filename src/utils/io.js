import get from 'lodash/get';
import ComponentRepository from './io/ComponentRepository';
import exportBookmarkletFromInspector from './io/exportBookmarkletFromInspector';
import exportJSONFromInspector from './io/exportJSONFromInspector';
import importConfigToInspector from './io/importConfigToInspector';
import importJSONToInspector from './io/importJSONToInspector';

const repo = new ComponentRepository();
const actions = {
	'import': {
		'config': importConfigToInspector,
		'json': importJSONToInspector
	},
	'export': {
		'bookmarklet': exportBookmarkletFromInspector,
		'json': exportJSONFromInspector
	}
};

export function mapIO(action, source, extra) {
	return { action, source, ...extra };
}

export function performInspectorIO(inspector, io) {
	const method = get(actions, `${io.action}.${io.source}`);
	if (method && typeof method === 'function') {
		method(inspector, repo, io);
	}
}

export { repo };
