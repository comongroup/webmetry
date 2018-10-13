import map from 'lodash/map';

export default function exportJSONFromInspector(inspector) {
	const arr = map(inspector.handler.components, component => {
		const optionsObject = component.serialize(true);
		const list = inspector.findCorrespondingPropList(component);
		const listObject = list ? list.serialize(true) : {};
		return {
			type: component.__internalId,
			options: optionsObject,
			list: listObject
		};
	});
	const output = JSON.stringify(arr);
	prompt('JSON output:', output);
}
