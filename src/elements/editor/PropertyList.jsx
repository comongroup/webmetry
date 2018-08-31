import { camelCase } from 'lodash';
import Component from '../../base/Component';
import renderPropEditor from '../../utils/editor/renderPropEditor';

export default class PropertyList extends Component {
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
		return <div className="wm-property-list">
			<div className="wm-property-list-title">{target.constructor.name}</div>
			<div className="wm-property-renderer">{children}</div>
		</div>;
	}
	mounted(dom) {
		dom.addEventListener('change', e => {
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
}
