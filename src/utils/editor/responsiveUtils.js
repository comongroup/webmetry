import convertEmptyToNull from '../convertEmptyToNull';

export function responsiveProps() {
	const common = {
		type: Number,
		hidden: true,
		filter: value => convertEmptyToNull(value, Number)
	};
	return {
		widthRangeMin: { ...common, placeholder: 'Min Width' },
		widthRangeMax: { ...common, placeholder: 'Max Width' },
		heightRangeMin: { ...common, placeholder: 'Min Height' },
		heightRangeMax: { ...common, placeholder: 'Max Height' },

		// now do virtual fields,
		// tricking the inspector to show two fields in one.
		widthRange: {
			header: 'Responsive',
			children: ['widthRangeMin', 'widthRangeMax']
		},
		heightRange: {
			children: ['heightRangeMin', 'heightRangeMax']
		}
	};
}

export function shouldComponentBeVisible(component, width, height) {
	const state = component.state;
	return (
		(state.widthRangeMin == null || width >= state.widthRangeMin) &&
		(state.widthRangeMax == null || width <= state.widthRangeMax) &&
		(state.heightRangeMin == null || height >= state.heightRangeMin) &&
		(state.heightRangeMax == null || height <= state.heightRangeMax)
	);
}

export function bindResponsiveEventsTo(component, handler) {
	component.on('change:widthRangeMin', handler);
	component.on('change:widthRangeMax', handler);
	component.on('change:heightRangeMin', handler);
	component.on('change:heightRangeMax', handler);
}

export function unbindResponsiveEventsFrom(component) {
	component.off('change:widthRangeMin');
	component.off('change:widthRangeMax');
	component.off('change:heightRangeMin');
	component.off('change:heightRangeMax');
}
