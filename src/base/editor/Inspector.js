import debounce from 'lodash/debounce';
import find from 'lodash/find';
import DialogHandler from './DialogHandler';
import PropertyList from '../../elements/editor/PropertyList';
import InspectorHeader from '../../elements/editor/InspectorHeader';
import { mapIO, performInspectorIO, repo } from '../../utils/io';
import { checkInspectorOnKey, dictionary } from '../../utils/keys';
import { bindNameEventsTo, unbindNameEventsFrom } from '../../utils/editor/nameUtils';
import renderIcon from '../../utils/editor/renderIcon';
import { bindResponsiveEventsTo, shouldComponentBeVisible, unbindResponsiveEventsFrom } from '../../utils/editor/responsiveUtils';
import observeObject from '../../utils/observeObject';

export default class Inspector extends DialogHandler {
	constructor(parent, handler) {
		// create inside element
		const inside = document.createElement('div');
		inside.className = 'wm-inspector-inside';
		super(inside);

		// create local state
		const state = {
			hideAll: false,
			hideWindow: false,
			snappedToBottom: false,
			x: 0,
			y: 0
		};
		this.state = observeObject(state, (key, newValue, oldValue) => {
			this.emit('change:' + key, newValue, oldValue);
			this.emit('change', key, newValue, oldValue);
		});

		// show or hide webmetry
		this.on('change:hideAll', hideAll => {
			this.handler.parent.classList.toggle('-wm-invisible', hideAll);
		});
		this.on('change:hideWindow', hideWindow => {
			this.container.classList.toggle('-wm-invisible', hideWindow);
		});

		// add webmetry keybindings straight away, like SHIFT+W
		dictionary.on('up:shift+w', () => {
			this.state.hideAll = !this.state.hideAll;
		});
		dictionary.on('up:shift+q', () => {
			this.state.hideWindow = !this.state.hideWindow;
		});
		dictionary.on('up', (e, { combo }) => {
			checkInspectorOnKey(e, this, combo);
		});

		// create container element
		this.container = document.createElement('div');
		this.container.className = 'wm-inspector';

		// create hint element
		this.hint = document.createElement('div');
		this.hint.className = 'wm-inspector-hint';
		this.hint.innerHTML = '<b>No components.</b>Start by adding one above...';

		// add inspector header
		this.header = this.add(new InspectorHeader({
			title: 'Webmetry',
			options: [
				{
					icon: 'import_export',
					title: 'Import/export...',
					onClick: () => this.spawnImportExportDialog()
				},
				{
					icon: 'add',
					title: 'Add component...',
					onClick: () => this.spawnAddComponentDialog()
				}
			]
		}));
		this.header.on('drag', this.moveContainer.bind(this));
		this.header.on('dragstop', this.moveContainerWithinBounds.bind(this));

		// handle the handler's events
		this.handler = handler;
		this.handler.on('add', component => {
			const propList = new PropertyList({ target: component });
			propList.on('change:expanded', () => {
				this.moveContainerWithinBounds();
			});
			propList.on('change:visible', () => {
				const responsiveVisible = shouldComponentBeVisible(component, window.innerWidth, window.innerHeight);
				const shouldBeVisible = propList.state.visible === 1 || (propList.state.visible === 2 && responsiveVisible);
				component.__internalInstance.dom.classList.toggle('-wm-invisible', !shouldBeVisible);
				propList.state.responsiveVisible = responsiveVisible; // update value and re-render
			});
			propList.on('trash', () => {
				if (confirm(`Remove this component?`)) {
					this.handler.remove(component);
				}
			});
			this.hint.classList.add('-wm-invisible');
			this.add(propList);
			this.moveContainerWithinBounds();
			// TODO: need to refactor all of this below
			bindNameEventsTo(component, debounce(() => {
				propList.emit('change');
			}, 500));
			bindResponsiveEventsTo(component, debounce(() => {
				propList.emit('change');
				propList.emit('change:visible');
			}, 200));
			propList.emit('change:visible');
			// TODO: need to refactor all of this above
		});
		this.handler.on('remove', components => {
			for (let i = 0; i < components.length; i++) {
				const component = components[i];
				unbindNameEventsFrom(component);
				unbindResponsiveEventsFrom(component);
				const propList = this.findCorrespondingPropList(component);
				if (propList) {
					this.remove(propList);
					this.moveContainerWithinBounds();
				}
			}
			if (this.handler.components.length < 1) {
				this.hint.classList.remove('-wm-invisible');
			}
		});

		// move header and selector, and add list
		this.container.appendChild(this.header.__internalInstance.dom);
		this.container.appendChild(this.hint);
		this.container.appendChild(inside);

		// set container position
		this.state.snappedToBottom = false;
		this.setContainerPosition(0, 0);
		this.onResize();

		// on resize?
		this.onResize = debounce(this.onResize.bind(this), 500);
		window.addEventListener('resize', this.onResize);

		// append the inspector to its place
		parent.appendChild(this.container);
	}
	findCorrespondingPropList(target) {
		return find(this.components, propList => propList.state.target && propList.state.target === target);
	}
	onResize() {
		this.moveContainerWithinBounds();

		// get current width and height, update header resolution label
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		this.header.state.subtitle = `(${windowWidth}x${windowHeight})`;

		// make every propList evaluate itself
		this.components.forEach(component => {
			component.emit('change:visible');
		});
	}
	setContainerPosition(x, y) {
		this.state.x = x;
		this.state.y = y;
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
		this.state.snappedToBottom = (currentTop - y) >= maxTop;
	}
	moveContainerWithinBounds() {
		// before getting sizes and whatnot,
		// let the browser do all the calcs
		setTimeout(() => {
			const docEl = (document.documentElement || document.body);
			const maxLeft = docEl.clientWidth - this.container.clientWidth;
			const maxTop = docEl.clientHeight - this.container.clientHeight;
			const currentLeft = parseInt(this.container.style.left || 0, 10);
			const currentTop = !this.state.snappedToBottom
				? parseInt(this.container.style.top || 0, 10)
				: maxTop; // snap to bottom cause boolean tells us to
			this.setContainerPosition(
				Math.max(0, Math.min(maxLeft, currentLeft)),
				Math.max(0, Math.min(maxTop, currentTop))
			);
		}, 1);
	}
	spawnAddComponentDialog() {
		this.spawnDialog({
			title: 'Add component...',
			items: repo.getList()
		}).on('select', ({ key, Constructor }) => {
			this.handler.add(new Constructor(), key);
		});
	}
	spawnImportExportDialog() {
		this.spawnDialog({
			title: 'Import/export...',
			items: [
				{ title: renderIcon('code', 'Config JSON'), ...mapIO('import', 'json'), header: 'Import' },
				{ title: renderIcon('code', 'Config JSON'), ...mapIO('export', 'json'), header: 'Export' },
				{ title: renderIcon('settings_ethernet', 'HTML Embed'), ...mapIO('export', 'embed') },
				{ title: renderIcon('link', 'Bookmarklet'), ...mapIO('export', 'bookmarklet') }
			]
		}).on('select', io => performInspectorIO(this, io));
	}
}
