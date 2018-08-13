import ColumnGrid from './src/elements/ColumnGrid';
import ComponentHandler from './src/base/ComponentHandler';
import './src/scss/main.scss';

// create element for all webmetry components
const wmElement = document.createElement('div');
wmElement.className = 'wm';
document.body.appendChild(wmElement);

const handler = new ComponentHandler(wmElement);
const grid = new ColumnGrid();

handler.add(grid);
