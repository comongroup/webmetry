import { TEXT_ELEMENT } from './element';

const isEvent = name => name.startsWith('on');
const isAttribute = name => !isEvent(name) && name !== 'children' && name !== 'style';
const isNew = (prev, next) => key => prev[key] !== next[key];
const isGone = (next) => key => !(key in next);

function getEventName(key) {
	return key.toLowerCase().substring(2);
}

/**
 * Creates a single HTMLElement based on a react-like DomSpec of `{ type, props }`.
 * Doesn't include children in props.
 * @param {DomSpec} element
 * @returns {HTMLElement}
 */
export function createDomElement(element) {
	const { type, props } = element;

	// create dom element
	const dom = type === TEXT_ELEMENT
		? document.createTextNode('')
		: document.createElement(type);

	// set props
	updateDomProps(dom, [], props);

	// return
	return dom;
}

/**
 * Updates an HTMLElement based on a react-like DomSpec of `{ type, props }`
 * with new properties, always checking if props need to be updated or not.
 * @param {HTMLElement} dom
 * @param {DomSpecProps} prevProps
 * @param {DomSpecProps} nextProps
 */
export function updateDomProps(dom, prevProps, nextProps) {
	// cache predicates for filtering functions
	const isGoneNow = isGone(nextProps);
	const isNewNow = isNew(prevProps, nextProps);

	// remove old event listeners
	Object.keys(prevProps)
		.filter(isEvent)
		.filter(key => isGoneNow(key) || isNewNow(key))
		.forEach(name => {
			const eventType = getEventName(name);
			dom.removeEventListener(eventType, prevProps[name]);
		});

	// add new event listeners
	Object.keys(nextProps)
		.filter(isEvent)
		.filter(isNewNow)
		.forEach(name => {
			const eventType = getEventName(name);
			dom.addEventListener(eventType, nextProps[name]);
		});

	// remove old unnecessary attributes
	Object.keys(prevProps)
		.filter(isAttribute)
		.filter(isGoneNow)
		.forEach(name => {
			dom[name] = null;
		});

	// add or update new attributes
	Object.keys(nextProps)
		.filter(isAttribute)
		.filter(isNewNow)
		.forEach(name => {
			dom[name] = nextProps[name];
		});

	// get style objects
	prevProps.style = prevProps.style || {};
	nextProps.style = nextProps.style || {};

	// remove old styles
	Object.keys(prevProps.style)
		.filter(isGone(nextProps.style))
		.forEach(key => {
			dom.style[key] = '';
		});

	// add or update new styles
	Object.keys(nextProps.style)
		.filter(isNew(prevProps.style, nextProps.style))
		.forEach(key => {
			dom.style[key] = nextProps.style[key];
		});
}
