import ColumnGrid from './src/elements/ColumnGrid';
import Webmetry from './src/oldclass';
window.wminstance = new Webmetry();

const cgrid = new ColumnGrid();
cgrid.on('change', (key, value, old) => {
	console.log(`changed ${key} from ${old} to ${value}`);
});
console.log(cgrid.render);
console.log(window.cgrid = cgrid);
