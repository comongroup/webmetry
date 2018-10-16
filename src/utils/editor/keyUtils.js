export function keyProps(defaultValue) {
	return {
		keyToggle: {
			type: String,
			label: 'Key toggle',
			default: defaultValue,
			placeholder: 'No key combo set'
		}
	};
}
