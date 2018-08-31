import { flattenDeep } from 'lodash';

// export text element constant used by JSX
export const TEXT_ELEMENT = 'TEXT ELEMENT';

/**
 * Creates a react-like DomSpec of `{ type, props }`.
 * @param {String} type
 * @param {Object} config
 * @param {DomSpec[]} children
 * @returns {DomSpec}
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
 * Creates a react-like DomSpec of `{ type, props }`.
 * @param {String} text
 * @returns {DomSpec}
 */
export function createTextElement(text) {
	return createElement(TEXT_ELEMENT, { nodeValue: text });
}
