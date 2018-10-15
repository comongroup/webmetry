import get from 'lodash/get';
import ComponentRepository from './io/ComponentRepository';
import * as inspectorIO from './io/inspector';

const repo = new ComponentRepository();
const actions = {
	'import': {
		'config': inspectorIO.importConfig,
		'json': inspectorIO.importJSON
	},
	'export': {
		'bookmarklet': inspectorIO.exportBookmarklet,
		'embed': inspectorIO.exportEmbed,
		'json': inspectorIO.exportJSON
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
