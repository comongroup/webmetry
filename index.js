import ColumnGrid from './src/elements/ColumnGrid';
import { reconcile } from './src/dom/render';
import './src/scss/main.scss';

// keep old class for comparison purposes
import Webmetry from './src/oldclass';
window.wminstance = new Webmetry();

// create element for all webmetry components
const wmElement = document.createElement('div');
wmElement.className = 'wm';
document.body.appendChild(wmElement);

// create test grid
const cgrid = new ColumnGrid();
let cgridEl = null;
let cgridRender = null;
cgrid.on('change', (key, value, old) => {
	console.log(`changed ${key} from ${old} to ${value}`);
	cgridEl = reconcile(wmElement, cgridEl, cgridRender, cgridRender = cgrid.render());
});
cgridEl = reconcile(wmElement, cgridEl, cgridRender, cgridRender = cgrid.render());
console.log(window.cgrid = cgrid);
