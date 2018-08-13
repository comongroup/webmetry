import Emitter from '../utils/Emitter';
import { reconcile } from '../dom/render';

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
				this.emit('change:' + key, component, value, old);
				this.emit('change', component, key, value, old);
			});

			// render for the first time now
			// and inform the component that it has been mounted
			this.render(component);
			component.mounted(component.instance.dom);

			// emit event that we're successfully added
			this.emit('add', component, length);
		}
	}
	remove(component) {
		const index = this.components.indexOf(component);
		if (index !== -1) {
			const deleted = this.components.splice(index, 1);
			if (component.instance) {
				this.parent.removeChild(component.instance.dom);
				component.unmounted(component.instance.dom);
				delete component.instance;
			}
			this.emit('remove', deleted, index);
		}
	}
	render(component) {
		if (component.instance) {
			const prevInstance = component.instance;
			const nextInstance = reconcile(this.parent, prevInstance, prevInstance.dom, component.render());
			component.instance = nextInstance;
		}
		else {
			const instance = reconcile(this.parent, null, null, component.render());
			component.instance = instance;
		}
	}
}
