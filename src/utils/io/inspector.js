import map from 'lodash/map';

// URL for file embeds
const url = 'https://luisjs.io/webmetry.min.js';

export function exportBookmarklet(inspector) {
	// get JSON from inspector,
	// but remove quotes from JSON keys to reduce string length
	const json = getJSON(inspector, null).replace(/"([^(")"]+)":/g, '$1:');

	// code parts
	const config = json !== '{}' ? `window.wmConfig=${json};` : '';
	const embed = `var s=document.createElement('script');s.defer=true;s.src='${url}';document.body.appendChild(s);`;
	const code = `(function(){${config}${embed}})()`;
	const final = `javascript:${code}`;

	// prompt now
	prompt('Here is your bookmarklet:', final);
}

export function exportEmbed(inspector) {
	// get JSON from inspector,
	// but remove quotes from JSON keys to reduce string length
	const json = getJSON(inspector, '\t').replace(/"([^(")"]+)":/g, '$1:');

	// code parts
	const config = `<script>\nwindow.wmConfig = ${json};\n</script>`;
	const embed = `<script src="${url}" defer></script>`;
	const final = `${config}\n${embed}`;

	// prompt now
	prompt('Here is your embed code:', final);
}

export function exportJSON(inspector) {
	prompt('JSON output:', getJSON(inspector, '\t'));
}

export function getConfig(inspector) {
	const obj = {};
	if (inspector.handler.components.length > 0) {
		obj.components = map(inspector.handler.components, component => {
			const optionsObject = component.serialize(true);
			const list = inspector.findCorrespondingPropList(component);
			const listObject = list ? list.serialize(true) : {};
			return {
				type: component.__internalId,
				options: optionsObject,
				list: listObject
			};
		});
	}
	return obj;
}

export function getJSON(inspector, spacer) {
	return JSON.stringify(getConfig(inspector), null, spacer || null);
}

export function importConfig(inspector, repo, io) {
	const config = io.config;
	const componentsToAdd = [];
	let stop = false;

	try {
		if (!(typeof config === 'object') || config instanceof Array) {
			throw new Error('JSON is not a valid Webmetry object');
		}

		// check if components exists and is not an array
		if (config.components) {
			if (!(config.components instanceof Array)) {
				throw new Error('JSON does not have a valid component array');
			}

			// analyse components in config
			if (config.components.length > 0) {
				config.components.forEach((obj, index) => {
					if (typeof obj !== 'object') {
						throw new Error(`Found an invalid object on array index ${index}`);
					}
					const entry = repo.grab(obj.type);
					if (!entry) {
						throw new Error(`"${obj.type}" is not a valid component type`);
					}
					const component = new entry.Constructor(obj.options || {});
					const list = obj.list || {};
					componentsToAdd.push({ type: obj.type, component, list });
				});
			}
		}
	}
	catch (e) {
		if (console && console.error) {
			console.error(e);
		}
		if (e.message) {
			alert('Webmetry Config triggered an error:\n' + e.message);
			stop = true;
		}
	}

	// if we're not to stop everything,
	// keep going by emptying components first
	if (!stop) {
		inspector.handler.empty();

		// add new components, if there are any
		if (componentsToAdd.length > 0) {
			componentsToAdd.forEach(obj => {
				inspector.handler.add(obj.component, obj.type);
				const propList = inspector.findCorrespondingPropList(obj.component);
				if (propList) {
					Object.assign(propList.state, obj.list || {});
				}
			});
		}
	}
}

export function importJSON(inspector, repo) {
	const input = prompt('Paste the JSON here.\nThis will replace everything, all current components will be removed.') || '';
	if (input.length > 0) {
		try {
			const config = JSON.parse(input);
			importConfig(inspector, repo, { config: config });
		}
		catch (e) {
			if (console && console.error) {
				console.error(e);
			}
			if (e.message) {
				alert('Webmetry JSON triggered an error:\n' + e.message);
			}
		}
	}
}
