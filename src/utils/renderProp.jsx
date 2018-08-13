import { startCase } from 'lodash';

export function renderPropEditorInput(target, propKey, propObject, value) {
	const name = 'wmprop-' + propKey;
	const props = { name, value };

	if (typeof propObject.render === 'function') {
		return propObject.render(propKey, propObject, value);
	}

	if (propObject.picker) {
		switch (propObject.picker) {
			case 'color': return <input type="color" {...props} />;
			case 'slider':
				if (propObject.range && propObject.range.length === 2) {
					props.min = propObject.range[0];
					props.max = propObject.range[1];
				}
				if (propObject.step) {
					props.step = propObject.step;
				}
				props.defaultValue = value;
				return <input type="range" {...props} />;
		}
	}

	switch (propObject.type) {
		case Number: return <input type="number" {...props} />;
		default: return <input type="text" {...props} />;
	}
}

export default function renderPropEditor(target, propKey, propObject, value) {
	const name = startCase(propKey);
	const input = renderPropEditorInput(target, propKey, propObject, value);

	return <label className="wm-property-field">
		<span className="prop-name" title={name}>{name}</span>
		<div className="prop-value">{input}</div>
	</label>;
}
