import ComponentHandler from './src/base/ComponentHandler';
import ColumnGrid from './src/elements/ColumnGrid';
import PropertyList from './src/elements/editor/PropertyList';
import './src/scss/main.scss';

// create element for all webmetry components
const wmElement = document.createElement('div');
wmElement.className = 'wm';
document.body.appendChild(wmElement);

const handler = new ComponentHandler(wmElement);
const grid = new ColumnGrid();
const props = new PropertyList();

props.state.target = grid;

handler.add(grid);
handler.add(props);
