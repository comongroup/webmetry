import { getJSONFromInspector } from './exportJSONFromInspector';

export default function exportBookmarkletFromInspector(inspector) {
	const json = getJSONFromInspector(inspector, null);
	const url = 'https://luisjs.io/webmetry.min.js';

	// code parts
	const config = json !== '[]' ? `window.wmConfig={components:${json}};` : '';
	const embed = `var s=document.createElement('script');s.defer=true;s.src='${url}';document.body.appendChild(s);`;
	const code = `(function(){${config}${embed}})()`;
	const final = `javascript:${code}`;

	// prompt now
	prompt('Here is your bookmarklet:', final);
}
