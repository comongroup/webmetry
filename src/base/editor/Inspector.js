import debounce from 'lodash/debounce';
import find from 'lodash/find';
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
			propList.on('change:visible', () => {
				const responsiveVisible = shouldComponentBeVisible(component, window.innerWidth, window.innerHeight);
				const shouldBeVisible = propList.state.visible === 1 || (propList.state.visible === 2 && responsiveVisible);
				component.__internalInstance.dom.classList.toggle('-wm-invisible', !shouldBeVisible);
			});
			propList.on('trash', () => {
				if (confirm(`Remove this component?`)) {
					this.handler.remove(component);
				}
			});
			this.add(propList);
			this.moveContainerWithinBounds();
			// TODO: need to refactor all of this below
			bindNameEventsTo(component, debounce(() => {
				propList.emit('change');
			}, 500));
			bindResponsiveEventsTo(component, debounce(() => {
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
		});

		// move header and selector, and add list
		this.container.appendChild(this.header.__internalInstance.dom);
		this.container.appendChild(inside);

		// set container position
		this.setContainerPosition(0, 0);
		this.moveContainerWithinBounds();

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
		}).on('select', ({ key, Constructor }) => {
			this.handler.add(new Constructor(), key);
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
				const input = prompt('Paste the JSON here.\nThis will replace all current components.');
				if (input) {
					try {
						const arr = JSON.parse(input);
						if (arr instanceof Array) {
							// TODO: maybe confirm() with component count summary before deleting?

							[ ...this.handler.components ].forEach(c => {
								this.handler.remove(c);
							});

							arr.forEach(obj => {
								const entry = repo.grab(obj.type);
								if (!entry) {
									console.warn(`component ${entry} not found`);
								}
								else {
									const component = new entry.Constructor(obj.options || {});
									this.handler.add(component, obj.type);
									if (obj.list) {
										const propList = this.findCorrespondingPropList(component);
										if (propList) {
											Object.assign(propList.state, obj.list || {});
										}
									}
								}
							});
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
				const arr = map(this.handler.components, component => {
					const optionsObject = component.serialize(true);
					const list = this.findCorrespondingPropList(component);
					const listObject = list ? list.serialize(true) : {};
					return {
						type: component.__internalId,
						options: optionsObject,
						list: listObject
					};
				});
				const output = JSON.stringify(arr, null, '\t');
				prompt('Here is the JSON code', output);
			}
		});
	}
}
