import Emitter from '../utils/Emitter';
import { reconcile } from '../dom';

export default class ComponentHandler extends Emitter {
	constructor(parent) {
		super();
		this.parent = parent;
		this.components = [];
	}
	add(component) {
		if (this.components.indexOf(component) === -1) {
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
			component.mounted(component.instance.dom);

			// emit event that we're successfully added
			this.emit('add', component, length);
		}
		return component;
	}
	remove(component) {
		const index = this.components.indexOf(component);
		if (index !== -1) {
			const deleted = this.components.splice(index, 1);
			if (component.instance) {
				const dom = component.instance.dom;
				if (dom.parentElement) {
					dom.parentElement.removeChild(dom);
				}
				component.unmounted(dom);
				delete component.instance;
			}
			this.emit('remove', deleted, index);
		}
		return component;
	}
	render(component) {
		if (component.instance) {
			const prevInstance = component.instance;
			const nextInstance = reconcile(this.parent, prevInstance, component.render());
			component.instance = nextInstance;
		}
		else {
			const instance = reconcile(this.parent, null, component.render());
			component.instance = instance;
		}
		return component;
	}
}
