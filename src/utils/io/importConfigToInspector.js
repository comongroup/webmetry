export default function importConfigToInspector(inspector, repo, io) {
	const result = [];
	const config = io.config;

	try {
		if (!(config.components instanceof Array)) {
			throw new Error('JSON is not a valid Webmetry array');
		}

		// analyse object
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
			result.push({ type: obj.type, component, list });
		});
	}
	catch (e) {
		if (console && console.error) {
			console.error(e);
		}
		if (e.message) {
			alert('Webmetry Config triggered an error:\n' + e.message);
		}
	}

	if (result.length > 0) {
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
