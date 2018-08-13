import { startCase } from 'lodash';
import { createElement } from '../dom/element';

export function renderPropInput(target, propKey, propObject, value) {
	const name = 'wmprop-' + propKey;
	const props = { name, value };

	if (propObject.picker) {
		switch (propObject.picker) {
			case 'color': return createElement('input', { type: 'color', ...props });
			case 'slider':
				if (propObject.range && propObject.range.length === 2) {
					props.min = propObject.range[0];
					props.max = propObject.range[1];
				}
				if (propObject.step) {
					props.step = propObject.step;
				}
				return createElement('input', { type: 'range', ...props });
		}
	}
	switch (propObject.type) {
		case Number: return createElement('input', { type: 'number', ...props });
		default: return createElement('input', { type: 'text', ...props });
	}
}

export default function renderPropEditor(target, propKey, propObject, value) {
	const name = startCase(propKey);
	const input = renderPropInput(target, propKey, propObject, value);

	return createElement('label', {
		className: 'wm-property-field'
	}, [
		createElement('span', { className: 'prop-name', title: name }, name),
		createElement('div', { className: 'prop-value' }, input)
	]);
}
