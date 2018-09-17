import renderIcon from './src/utils/editor/renderIcon';
import ComponentHandler from './src/base/ComponentHandler';
import ComponentInspector from './src/base/ComponentInspector';
import ColumnGrid from './src/elements/ColumnGrid';
import FreeRuler from './src/elements/FreeRuler';
import './src/scss/main.scss';

// create element for all webmetry components
const wmElement = document.createElement('div');
wmElement.className = 'wm';
document.body.appendChild(wmElement);

// configure main component handler, and inspector
const handler = new ComponentHandler(wmElement);
const inspector = new ComponentInspector(wmElement, handler, [
	{ title: renderIcon('view_column', 'ColumnGrid'), c: ColumnGrid },
	{ title: renderIcon('straighten', 'Free Ruler'), c: FreeRuler }
]);
window.wmInstance = { handler, inspector };
