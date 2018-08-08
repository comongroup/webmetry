import { createDomElement, updateDomProps } from './utils';

export function reconcile(container, prevDom, prevElement, nextElement) {
	if (!prevDom || prevElement.type !== nextElement.type) {
		// root element is brand new!
		// need to throw everything out and recreate
		const newDom = render(nextElement);
		if (prevDom) {
			// there was a previous DOM element, so replace
			container.replaceChild(prevDom, newDom);
		}
		else {
			// there wasn't any element yet, append now
			container.appendChild(newDom);
		}
		return newDom;
	}
	else {
		// root element is the same!
		// update props and reconcile children
		updateDomProps(prevDom, prevElement.props, nextElement.props);
		// TODO: update children
		console.log('updated props but not children yet');
		return prevDom;
	}
}

export function render(element, parent) {
	const dom = createDomElement(element);
	if (element.props.children) {
		element.props.children.forEach(child => {
			render(child, dom);
		});
	}
	if (parent) {
		parent.appendChild(dom);
	}
	return dom;
}
