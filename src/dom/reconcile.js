import { createInstance } from './instance';
import { updateDomProps } from './utils';

export function reconcile(parentDom, currentInstance, nextElement) {
	if (!currentInstance) {
		// create brand new instance
		const nextInstance = createInstance(nextElement);
		parentDom.appendChild(nextInstance.dom);
		return nextInstance;
	}
	else if (!nextElement) {
		// remove instance cause element is empty
		parentDom.removeChild(currentInstance.dom);
		return null;
	}
	else if (currentInstance.element.type !== nextElement.type) {
		// replace instance cause element is of a different type
		const nextInstance = createInstance(nextElement);
		parentDom.replaceChild(nextInstance.dom, currentInstance.dom);
		return nextInstance;
	}
	else if (typeof nextElement.type === 'string') {
		// update instance props and children
		updateDomProps(currentInstance.dom, currentInstance.element.props, nextElement.props);
		currentInstance.childInstances = reconcileChildren(currentInstance, nextElement);
		currentInstance.element = nextElement;
		return currentInstance;
	}
	else {
		// update composite instance
		// https://github.com/pomber/didact/blob/2e290ff5c486b8a3f361abcbc6e36e2c21db30b8/src/reconciler.js#L36
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
		const nextChildInstance = reconcile(parentDom, prevChildInstance, nextChildElement);
		nextChildInstances.push(nextChildInstance);
	}
	return nextChildInstances.filter(instance => instance != null);
}
