import ComponentHandler from './src/base/ComponentHandler';
import ComponentInspector from './src/base/ComponentInspector';
import ColumnGrid from './src/elements/ColumnGrid';
import './src/scss/main.scss';

// create element for all webmetry components
const wmElement = document.createElement('div');
wmElement.className = 'wm';
document.body.appendChild(wmElement);

// configure main component handler, and inspector
const handler = new ComponentHandler(wmElement);
const inspector = new ComponentInspector(wmElement, handler, [
	{ title: '📱 ColumnGrid', c: ColumnGrid }
]);
window.wmInstance = { handler, inspector };
