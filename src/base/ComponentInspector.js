import ComponentHandler from './ComponentHandler';
import PropertyList from '../elements/editor/PropertyList';
import InspectorHeader from '../elements/editor/InspectorHeader';

export default class ComponentInspector extends ComponentHandler {
	constructor(parent, handler) {
		// create container element
		const container = document.createElement('div');
		container.className = 'wm-inspector';

		// create inside element
		const inside = document.createElement('div');
		inside.className = 'wm-inspector-inside';
		super(inside);

		// add inspector header
		this.header = new InspectorHeader();
		this.header.on('drag', (x, y) => {
			const currentLeft = parseInt(container.style.left || 0, 10);
			const currentTop = parseInt(container.style.top || 0, 10);
			container.style.left = currentLeft - x + 'px';
			container.style.top = currentTop - y + 'px';
		});
		this.header.on('dragstop', () => {
			// TODO: make element stay within window bounds
		});
		this.add(this.header);

		// handle the handler's events
		this.handler = handler;
		this.handler.on('add', component => {
			const propList = new PropertyList({ target: component });
			propList.on('trash', () => {
				this.handler.remove(propList.state.target);
				this.remove(propList);
			});
			this.add(propList);
		});
		this.handler.on('remove', components => {
			for (let i = 0; i < components.length; i++) {
				const component = components[i];
				for (let j = 0; j < this.components.length; j++) {
					const propList = this.components[j];
					if (propList.state.target && propList.state.target === component) {
						this.remove(propList);
						break;
					}
				}
			}
		});

		// add header and list, then append the inspector to its place
		parent.appendChild(container);
		container.appendChild(this.header.instance.dom);
		container.appendChild(inside);
	}
}
