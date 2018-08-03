import ColumnGrid from './src/elements/ColumnGrid';

const cgrid = new ColumnGrid();
cgrid.on('change', (key, value, old) => {
	console.log(`changed ${key} from ${old} to ${value}`);
});

console.log(window.cgrid = cgrid);
