import renderIcon from './renderIcon';

export function nameProps(placeholder) {
	return {
		nameOverride: {
			type: String,
			label: 'Name',
			placeholder
		}
	};
}

export function renderComponentName(defaultName) {
	return component => component.state.nameOverride || defaultName;
}

export function renderComponentNameWithIcon(icon, defaultName) {
	return component => renderIcon(icon, component.state.nameOverride || defaultName);
}

export function bindNameEventsTo(component, handler) {
	component.on('change:nameOverride', handler);
}

export function unbindNameEventsFrom(component) {
	component.off('change:nameOverride');
}
