import { createDomElement } from './utils';

/**
 * Creates a DomInstance of `{ element, dom, childInstances }` based on a react-like DomSpec of `{ type, props }`.
 * Generates everything, including instances for all children, from scratch.
 * @param {DomSpec} element
 * @returns {DomInstance}
 */
export function createInstance(element) {
	// create root element with props
	const dom = createDomElement(element);

	// create children instances
	const childElements = element.props.children || [];
	const childInstances = childElements.map(createInstance);
	const childDoms = childInstances.map(instance => instance.dom);
	childDoms.forEach(childDom => dom.appendChild(childDom));

	// return instance
	return { element, dom, childInstances };
}
