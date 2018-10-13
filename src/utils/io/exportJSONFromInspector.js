import map from 'lodash/map';

export function getJSONFromInspector(inspector, spacer) {
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
	return JSON.stringify(arr, null, spacer || null);
}

export default function exportJSONFromInspector(inspector) {
	prompt('JSON output:', getJSONFromInspector(inspector, '\t'));
}
