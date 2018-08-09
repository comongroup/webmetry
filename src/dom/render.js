import { createDomTree, updateDomProps } from './utils';

export function reconcile(container, prevDom, prevElement, nextElement) {
	if (!prevDom) {
		// root element is brand new!
		// need to generate from scratch
		const newDom = createDomTree(nextElement);
		container.appendChild(newDom);
		return newDom;
	}
	else if (prevElement.type !== nextElement.type) {
		// root element is different!
		// need to recreate and replace
		const newDom = createDomTree(nextElement);
		container.replaceChild(prevDom, newDom);
		return newDom;
	}
	else {
		// root element is the same!
		// need to update props and reconcile children
		updateDomProps(prevDom, prevElement.props, nextElement.props);
		// TODO: update children
		console.log('updated props but not children yet');
		return prevDom;
	}
}
