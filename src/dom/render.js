import { createInstance, updateDomProps } from './utils';

export function reconcile(parentDom, currentInstance, currentElement, nextElement) {
	if (!currentInstance) {
		// root element is brand new!
		// need to generate from scratch
		const nextInstance = createInstance(nextElement);
		parentDom.appendChild(nextInstance.dom);
		return nextInstance;
	}
	else if (!nextElement) {
		// next element is empty!
		// need to remove everything
		parentDom.removeChild(currentInstance.dom);
		return null;
	}
	else if (currentElement.type !== nextElement.type) {
		// root element is different!
		// need to recreate and replace
		const nextInstance = createInstance(nextElement);
		parentDom.replaceChild(nextInstance.dom, currentInstance.dom);
		return nextInstance;
	}
	else {
		// root element is the same!
		// need to update props and reconcile children
		updateDomProps(currentInstance.dom, currentElement.props, nextElement.props);
		currentInstance.childInstances = reconcileChildren(currentInstance, nextElement);
		currentInstance.element = nextElement;
		return currentInstance;
	}
}

export function reconcileChildren(currentInstance, nextElement) {
	const parentDom = currentInstance.dom;
	const prevChildInstances = currentInstance.childInstances;
	const nextChildElements = nextElement.props.children || [];
	const nextChildInstances = [];
	const count = Math.max(prevChildInstances.length, nextChildElements.length);
	for (let i = 0; i < count; i++) {
		const prevChildInstance = prevChildInstances[i];
		const nextChildElement = nextChildElements[i];
		const nextChildInstance = reconcile(parentDom, prevChildInstance, (prevChildInstance || {}).element, nextChildElement);
		nextChildInstances.push(nextChildInstance);
	}
	return nextChildInstances.filter(instance => instance != null);
}
