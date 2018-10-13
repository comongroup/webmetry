import Emitter from '../utils/Emitter';
import { reconcile } from '../dom';

export default class ComponentHandler extends Emitter {
	constructor(parent) {
		super();
		this.parent = parent;
		this.components = [];
	}
	add(component, id) {
		if (this.components.indexOf(component) === -1) {
			// add internal id to instance
			component.__internalId = id || `component${Math.round(Math.random() * 999999)}`;

			// get new index of component
			const length = this.components.push(component);

			// bind to component changes
			// so that we know when to rerender
			component.on('change', (key, value, old) => {
				this.render(component);
				if (key != null) {
					this.emit('change:' + key, component, value, old);
					this.emit('change', component, key, value, old);
				}
			});

			// render for the first time now
			// and inform the component that it has been mounted
			this.render(component);
			component.mounted(component.__internalInstance.dom);

			// emit event that we're successfully added
			this.emit('add', component, length);
		}
		return component;
	}
	remove(component) {
		const index = this.components.indexOf(component);
		if (index !== -1) {
			const deleted = this.components.splice(index, 1);
			if (component.__internalInstance) {
				const dom = component.__internalInstance.dom;
				if (dom.parentElement) {
					dom.parentElement.removeChild(dom);
				}
				component.unmounted(dom);
			}
			delete component.__internalInstance;
			delete component.__internalId;
			this.emit('remove', deleted, index);
		}
		return component;
	}
	render(component) {
		if (component.__internalInstance) {
			const prevInstance = component.__internalInstance;
			const nextInstance = reconcile(this.parent, prevInstance, component.render());
			component.__internalInstance = nextInstance;
		}
		else {
			const instance = reconcile(this.parent, null, component.render());
			component.__internalInstance = instance;
		}
		component.rendered(component.__internalInstance.dom);
		return component;
	}
}
