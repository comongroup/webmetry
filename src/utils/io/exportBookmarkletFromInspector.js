import { getJSONFromInspector } from './exportJSONFromInspector';

export default function exportBookmarkletFromInspector(inspector) {
	// get URL for file, and JSON from inspector,
	// but remove quotes from JSON keys to reduce string length
	const url = 'https://luisjs.io/webmetry.min.js';
	const json = getJSONFromInspector(inspector, null).replace(/"([^(")"]+)":/g, '$1:');

	// code parts
	const config = json !== '[]' ? `window.wmConfig={components:${json}};` : '';
	const embed = `var s=document.createElement('script');s.defer=true;s.src='${url}';document.body.appendChild(s);`;
	const code = `(function(){${config}${embed}})()`;
	const final = `javascript:${code}`;

	// prompt now
	prompt('Here is your bookmarklet:', final);
}
