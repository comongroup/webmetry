import renderIcon from './src/utils/editor/renderIcon';
import ComponentHandler from './src/base/ComponentHandler';
import ComponentInspector from './src/base/ComponentInspector';
import ColumnGrid from './src/elements/ColumnGrid';
import BaseLines from './src/elements/BaseLines';
import './src/scss/main.scss';

// create element for all webmetry components
const wmElement = document.createElement('div');
wmElement.className = 'wm';
document.body.appendChild(wmElement);

// configure main component handler, and inspector
const handler = new ComponentHandler(wmElement);
const inspector = new ComponentInspector(wmElement, handler, [
	{ title: renderIcon('view_column', 'ColumnGrid'), c: ColumnGrid },
	{ title: renderIcon('view_headline', 'Baselines'), c: BaseLines }
]);
window.wmInstance = { handler, inspector };
