import ComponentHandler from './ComponentHandler';
import PropertyList from '../elements/editor/PropertyList';
import InspectorHeader from '../elements/editor/InspectorHeader';
import InspectorDialogSelector from '../elements/editor/InspectorDialogSelector';
import outsideElementCallback from '../utils/outsideElementCallback';

export default class ComponentInspector extends ComponentHandler {
	constructor(parent, handler, components) {
		// create inside element
		const inside = document.createElement('div');
		inside.className = 'wm-inspector-inside';
		super(inside);

		// create container element
		this.container = document.createElement('div');
		this.container.className = 'wm-inspector';

		// add inspector header
		this.header = this.add(new InspectorHeader({
			title: 'Webmetry'
		}));
		this.header.on('select', () => {
			this.selector.show();
			this.moveContainerWithinBounds();
		});
		this.header.on('drag', (x, y) => {
			this.moveContainer(x, y);
		});
		this.header.on('dragstop', () => {
			this.moveContainerWithinBounds();
		});

		// add inspector dialog selector
		this.selector = this.add(new InspectorDialogSelector({
			components: components || [],
			title: 'Add component'
		}));
		this.selector.on('select', component => {
			this.handler.add(new component()); // eslint-disable-line new-cap
			this.selector.hide();
		});
		this.selector.on('change:showing', showing => {
			if (showing) {
				setTimeout(() => {
					document.addEventListener('click', this.hideSelector);
				}, 1);
			}
			else {
				document.removeEventListener('click', this.hideSelector);
			}
		});
		this.hideSelector = outsideElementCallback(this.selector.instance.dom, () => {
			this.selector.hide();
		});

		// handle the handler's events
		this.handler = handler;
		this.handler.on('add', component => {
			const propList = new PropertyList({ target: component });
			propList.on('change:hidden', () => {
				this.moveContainerWithinBounds();
			});
			propList.on('trash', () => {
				this.handler.remove(propList.state.target);
				this.remove(propList);
			});
			this.add(propList);
			this.moveContainerWithinBounds();
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

		// move header and selector, and add list
		this.container.appendChild(this.header.instance.dom);
		this.container.appendChild(this.selector.instance.dom);
		this.container.appendChild(inside);

		// append the inspector to its place
		parent.appendChild(this.container);
	}
	moveContainer(x, y) {
		const currentLeft = parseInt(this.container.style.left || 0, 10);
		const currentTop = parseInt(this.container.style.top || 0, 10);
		this.container.style.left = (currentLeft - x) + 'px';
		this.container.style.top = (currentTop - y) + 'px';
	}
	moveContainerWithinBounds() {
		setTimeout(() => {
			const docEl = (document.documentElement || document.body);
			const maxLeft = docEl.clientWidth - this.container.clientWidth;
			const maxTop = docEl.clientHeight - this.container.clientHeight;
			const currentLeft = parseInt(this.container.style.left || 0, 10);
			const currentTop = parseInt(this.container.style.top || 0, 10);
			this.container.style.left = Math.max(0, Math.min(maxLeft, currentLeft)) + 'px';
			this.container.style.top = Math.max(0, Math.min(maxTop, currentTop)) + 'px';
		}, 1);
	}
	snapContainerToBottom() {
		// TODO: actually call this method
		const docEl = (document.documentElement || document.body);
		const maxTop = docEl.clientHeight - this.container.clientHeight;
		this.container.style.top = maxTop + 'px';
	}
}
