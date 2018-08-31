import { camelCase } from 'lodash';
import Component from '../../base/Component';
import renderPropEditor from '../../utils/editor/renderPropEditor';

export default class PropertyList extends Component {
	constructor(options) {
		super(options, {
			hidden: { type: Boolean, default: true },
			target: { type: Component }
		});
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
		return <div className={`wm-property-list${this.state.hidden ? ' -wm-hidden' : ''}`}>
			<div className="wm-property-list-header -wm-flex" onClick={e => this.toggleHiddenState(e)}>
				<span className="-wmfl-option" title={this.state.hidden ? 'Expand properties' : 'Hide properties'}>{this.state.hidden ? '▼' : '▲'}</span>
				<span className="-wmfl-title">{target.name}</span>
				<span className="-wmfl-option -wmfl-on-hover" title="Delete component" onClick={e => this.deleteTarget(e)}>🗑️</span>
			</div>
			<div className="wm-property-list-props">{children}</div>
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
		this.emit('input', target, prop, convertedValue);
	}
	toggleHiddenState(e) {
		this.state.hidden = !this.state.hidden;
	}
	deleteTarget(e) {
		e.stopPropagation();
		this.emit('trash');
	}
}
