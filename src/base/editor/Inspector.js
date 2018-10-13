import debounce from 'lodash/debounce';
import map from 'lodash/map';
import DialogHandler from './DialogHandler';
import PropertyList from '../../elements/editor/PropertyList';
import InspectorHeader from '../../elements/editor/InspectorHeader';
import { repo } from '../../utils/io';
import { bindNameEventsTo, unbindNameEventsFrom } from '../../utils/editor/nameUtils';
import renderIcon from '../../utils/editor/renderIcon';
import { bindResponsiveEventsTo, shouldComponentBeVisible, unbindResponsiveEventsFrom } from '../../utils/editor/responsiveUtils';

export default class Inspector extends DialogHandler {
	constructor(parent, handler) {
		// create inside element
		const inside = document.createElement('div');
		inside.className = 'wm-inspector-inside';
		super(inside);

		// create container element
		this.container = document.createElement('div');
		this.container.className = 'wm-inspector';

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
			propList.on('change:visible', visible => {
				component.__internalInstance.dom.classList.toggle('-wm-invisible', !visible);
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
		this.container.appendChild(this.header.__internalInstance.dom);
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
	spawnAddComponentDialog() {
		this.spawnDialog({
			title: 'Add component...',
			items: repo.getList()
		}).on('select', ({ id, Constructor }) => {
			const instance = new Constructor();
			this.handler.add(instance, id);
		});
	}
	spawnImportExportDialog() {
		// TODO: transform these into proper redirects
		const objImport = source => ({ action: 'import', source });
		const objExport = source => ({ action: 'export', source });

		this.spawnDialog({
			title: 'Import/export...',
			items: [
				{ title: renderIcon('redo', 'Import from JSON'), ...objImport('json') },
				{ title: renderIcon('undo', 'Export as JSON'), ...objExport('json') }
			]
		}).on('select', ({ action, source }) => {
			if (action === 'import') {
				const input = prompt('Paste the JSON here.\nThis will clear current components.');
				if (input) {
					try {
						const arr = JSON.parse(input);
						if (arr instanceof Array) {
							// TODO:
							// * clear whole current array
							// * import components from json
							console.log(arr);
						}
						else {
							throw new Error('JSON is not a valid Webmetry array');
						}
					}
					catch (e) {
						console.error(e);
						if (e.message) {
							alert('JSON triggered an error:\n' + e.message);
						}
					}
				}
			}
			else if (action === 'export' && source === 'json') {
				const arr = map(this.handler.components, c => ({
					type: c.__internalId,
					options: c.serialize()
				}));
				const output = JSON.stringify(arr, null, '\t');
				prompt('Here is the JSON code', output);
			}
		});
	}
}
