import ComponentHandler from './src/base/ComponentHandler';
import Inspector from './src/base/editor/Inspector';
import bindComponents from './src/bindComponents';
import { mapIO, performInspectorIO, repo } from './src/utils/io';
import './src/scss/main.scss';

// add components to repo first
bindComponents(repo);

// create element for all webmetry components
const wmElement = document.createElement('div');
wmElement.className = 'wm';
document.body.appendChild(wmElement);

// configure main component handler, and inspector
const handler = new ComponentHandler(wmElement);
const inspector = new Inspector(wmElement, handler);
window.wmInstance = { handler, inspector };

// import config
if (window.wmConfig) {
	performInspectorIO(inspector, mapIO('import', 'config', { config: window.wmConfig }));
}
