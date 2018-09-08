import { debounce } from 'lodash';
import ComponentHandler from './ComponentHandler';
import PropertyList from '../elements/editor/PropertyList';
import InspectorHeader from '../elements/editor/InspectorHeader';
import InspectorDialogSelector from '../elements/editor/InspectorDialogSelector';
import outsideElementCallback from '../utils/outsideElementCallback';
import { bindNameEventsTo, unbindNameEventsFrom } from '../utils/editor/nameUtils';
import { bindResponsiveEventsTo, shouldComponentBeVisible, unbindResponsiveEventsFrom } from '../utils/editor/responsiveUtils';

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
			this.moveDialogWithinBounds();
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
			title: 'Add component...'
		}));
		this.selector.on('select', component => {
			this.handler.add(new component()); // eslint-disable-line new-cap
			this.selector.hide();
		});
		this.selector.on('change:showing', showing => {
			if (showing) {
				setTimeout(() => {
					// before adding the event that detects whether it should be closed or not
					// when clicked outside... actually wait 1ms, otherwise the event will fire right away
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
			propList.on('change:expanded', () => {
				this.moveContainerWithinBounds();
			});
			propList.on('change:visible', visible => {
				component.instance.dom.classList.toggle('-wm-invisible', !visible);
			});
			propList.on('check:resize', (width, height) => {
				propList.state.visible = shouldComponentBeVisible(component, width, height);
			});
			propList.on('trash', () => {
				if (confirm(`Remove this component?`)) {
					this.handler.remove(propList.state.target);
				}
			});
			this.add(propList);
			this.moveContainerWithinBounds();
			// TODO: need to refactor all of this below
			const nameHandler = debounce(() => {
				propList.emit('change');
			}, 500);
			const responsiveHandler = debounce(() => {
				this.makePropListCheckResize(propList);
			}, 200);
			bindNameEventsTo(component, nameHandler);
			bindResponsiveEventsTo(component, responsiveHandler);
			responsiveHandler();
			// TODO: need to refactor all of this above
		});
		this.handler.on('remove', components => {
			for (let i = 0; i < components.length; i++) {
				const component = components[i];
				unbindNameEventsFrom(component);
				unbindResponsiveEventsFrom(component);
				for (let j = 0; j < this.components.length; j++) {
					const propList = this.components[j];
					if (propList.state.target && propList.state.target === component) {
						this.remove(propList);
						this.moveContainerWithinBounds();
						break;
					}
				}
			}
		});

		// move header and selector, and add list
		this.container.appendChild(this.header.instance.dom);
		this.container.appendChild(this.selector.instance.dom);
		this.container.appendChild(inside);

		// set container position
		this.setContainerPosition(0, 0);
		this.moveContainerWithinBounds();

		// on resize?
		this.onResize = debounce(this.onResize.bind(this), 500);
		this.onResize();
		window.addEventListener('resize', this.onResize);

		// append the inspector to its place
		parent.appendChild(this.container);
	}
	setContainerPosition(x, y) {
		this.container.style.left = x + 'px';
		this.container.style.top = y + 'px';
	}
	moveContainer(x, y) {
		const currentLeft = parseInt(this.container.style.left || 0, 10);
		const currentTop = parseInt(this.container.style.top || 0, 10);
		this.setContainerPosition(
			currentLeft - x,
			currentTop - y
		);

		// check if container should be snapped to bottom
		const docEl = (document.documentElement || document.body);
		const maxTop = docEl.clientHeight - this.container.clientHeight;
		this.snappedToBottom = (currentTop - y) >= maxTop;
	}
	moveContainerWithinBounds() {
		// before getting sizes and whatnot,
		// let the browser do all the calcs
		setTimeout(() => {
			const docEl = (document.documentElement || document.body);
			const maxLeft = docEl.clientWidth - this.container.clientWidth;
			const maxTop = docEl.clientHeight - this.container.clientHeight;
			const currentLeft = parseInt(this.container.style.left || 0, 10);
			const currentTop = !this.snappedToBottom
				? parseInt(this.container.style.top || 0, 10)
				: maxTop; // snap to bottom cause boolean tells us to
			this.setContainerPosition(
				Math.max(0, Math.min(maxLeft, currentLeft)),
				Math.max(0, Math.min(maxTop, currentTop))
			);
		}, 1);
	}
	moveDialogWithinBounds() {
		// before getting sizes and whatnot,
		// let the browser do all the calcs
		setTimeout(() => {
			// TODO: calc bounds
			console.log('move dialog within window bounds now');
		}, 1);
	}
	onResize() {
		this.moveContainerWithinBounds();

		// get current width and height, update header resolution label
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		this.header.state.subtitle = `(${windowWidth}x${windowHeight})`;

		// make every propList evaluate itself
		this.components.forEach(component => {
			component.emit('check:resize', windowWidth, windowHeight);
		});
	}
	makePropListCheckResize(propList) {
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		propList.emit('check:resize', windowWidth, windowHeight);
	}
}
