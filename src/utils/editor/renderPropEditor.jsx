import { map, startCase } from 'lodash';

export function renderPropEditorInput(target, propKey, propObject, value, isRecursive) {
	const name = 'wmprop-' + propKey;
	const props = {
		name,
		value,
		placeholder: propObject.placeholder
	};

	if (typeof propObject.render === 'function') {
		return propObject.render(propKey, propObject, value);
	}

	if (propObject.children && !isRecursive) {
		return map(propObject.children, childKey => {
			return renderPropEditorInput(target, childKey, target.props[childKey], target.state[childKey], true);
		});
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
				delete props.value; // this is necessary cause of min and max order
				props.value = value;
				props.defaultValue = value;
				return <input type="range" {...props} />;
		}
	}

	switch (propObject.type) {
		case Number: return <input type="number" {...props} />;
		case Boolean:
			props.checked = props.value;
			return <input type="checkbox" {...props} />;
		default: return <input type="text" {...props} />;
	}
}

export default function renderPropEditor(target, propKey, propObject, value) {
	const name = startCase(propKey);
	const title = propObject.title || name;
	const input = renderPropEditorInput(target, propKey, propObject, value);

	return <label className="wm-property-field">
		<span className="prop-name" title={title}>{name}</span>
		<div className="prop-value">{input}</div>
	</label>;
}
