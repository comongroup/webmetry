import map from 'lodash/map';

export default function importJSONToInspector(inspector, repo) {
	const result = [];
	const input = prompt('Paste the JSON here.\nThis will replace all current components.') || '[]';

	try {
		const arr = JSON.parse(input);
		if (!(arr instanceof Array)) {
			throw new Error('JSON is not a valid Webmetry array');
		}

		// analyse object
		arr.forEach((obj, index) => {
			if (typeof obj !== 'object') {
				throw new Error(`Found an invalid object on array index ${index}`);
			}
			const entry = repo.grab(obj.type);
			if (!entry) {
				throw new Error(`"${obj.type}" is not a valid component type`);
			}
			const component = new entry.Constructor(obj.options || {});
			const list = obj.list || {};
			result.push({ type: obj.type, component, list });
		});
	}
	catch (e) {
		if (console && console.error) {
			console.error(e);
		}
		if (e.message) {
			alert('Webmetry JSON triggered an error:\n' + e.message);
		}
	}

	if (result.length > 0) {
		const componentList = map(result, item => {
			if (item.component.state.nameOverride) {
				return `${item.component.state.nameOverride} (${item.type})`;
			}
			return item.type;
		});
		if (confirm(`This will add the following components:\n\n- ${componentList.join('\n- ')}\n\nContinue?`)) {
			inspector.handler.empty();
			result.forEach(obj => {
				inspector.handler.add(obj.component, obj.type);
				const propList = inspector.findCorrespondingPropList(obj.component);
				if (propList) {
					Object.assign(propList.state, obj.list || {});
				}
			});
		}
	}
}
