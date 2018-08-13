import { camelCase } from 'lodash';
import Component from '../../base/Component';
import { createElement } from '../../dom/element';
import renderPropEditor from '../../utils/renderProp';

export default class PropertyRenderer extends Component {
	constructor(options) {
		super(options, {});
	}
	render() {
		const children = [];
		const target = this.state.target;
		if (!(target instanceof Component)) {
			children.push('Nothing to render');
		}
		else {
			Object.keys(target.props).forEach(key => {
				const child = renderPropEditor(target, camelCase(key), target.props[key], target.state[key]);
				children.push(child);
			});
		}
		return createElement('div', { className: 'wm-property-renderer' }, children);
	}
	mounted(dom) {
		dom.addEventListener('change', (e) => {
			const name = (e.target.name || '').replace('wmprop-', '');
			const value = (e.target.value || '').trim();
			if (this.state.target && name in this.state.target.props) {
				this.setValue(name, value);
			}
		});
	}
	setValue(key, value) {
		const target = this.state.target;
		const prop = target.props[key];
		const convertedValue = prop.type(value);
		target.state[key] = convertedValue;
	}
	setTarget(target) {
		this.state.target = target;
	}
}
