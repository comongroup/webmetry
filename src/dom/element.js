import { flattenDeep } from 'lodash';

// export text element constant used by JSX
export const TEXT_ELEMENT = 'TEXT ELEMENT';

/**
 * Creates a react-like DomSpec.
 * @param {String} type
 * @param {Object} config
 * @param {DomSpec[]} children
 */
export function createElement(type, config, ...children) {
	const props = Object.assign({}, config);
	const rawChildren = children.length > 0 ? flattenDeep(children) : [];
	props.children = rawChildren
		.filter(c => c != null && c !== false)
		.map(c => c instanceof Object ? c : createTextElement(c));
	return { type, props };
}

/**
 * Creates a react-like DomSpec.
 * @param {String} text
 */
export function createTextElement(text) {
	return createElement(TEXT_ELEMENT, { nodeValue: text });
}
