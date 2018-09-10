import ComponentHandler from './src/base/ComponentHandler';
import ComponentInspector from './src/base/ComponentInspector';
import bindComponents from './src/bindComponents';
import { repo } from './src/utils/io';
import './src/scss/main.scss';

// add components to repo first
bindComponents(repo);

// create element for all webmetry components
const wmElement = document.createElement('div');
wmElement.className = 'wm';
document.body.appendChild(wmElement);

// configure main component handler, and inspector
const handler = new ComponentHandler(wmElement);
const inspector = new ComponentInspector(wmElement, handler, repo.getList());
window.wmInstance = { handler, inspector };
