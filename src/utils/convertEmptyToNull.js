export default function convertEmptyToNull(value, transformer) {
	return value === ''
		? null
		: (typeof transformer === 'function'
			? transformer(value)
			: value);
}
