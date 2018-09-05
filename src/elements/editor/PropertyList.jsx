import { camelCase } from 'lodash';
import Component from '../../base/Component';
import renderPropEditor from '../../utils/editor/renderPropEditor';

export default class PropertyList extends Component {
	constructor(options) {
		super(options, {
			target: { type: Component },
			visible: { type: Boolean, default: true },
			expanded: { type: Boolean, default: true }
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
				const prop = target.props[key];
				if (prop.hidden !== true) {
					if (prop.header) {
						children.push(<div className="wm-property-field-header">{prop.header}</div>);
					}
					if (prop.type != null || prop.children instanceof Array) {
						const child = renderPropEditor(target, camelCase(key), prop, target.state[key]);
						children.push(child);
					}
				}
			});
		}
		return <div className={`wm-property-list${this.state.expanded ? ' -wm-expanded' : ''}`}>
			<div className="wm-property-list-header -wm-flex" onClick={e => this.toggleExpandedState(e)}>
				<span className="-wmfl-option" title={this.state.expanded ? 'Hide properties' : 'Expand properties'}>
					{this.state.expanded
						? <i className="material-icons">keyboard_arrow_up</i>
						: <i className="material-icons">keyboard_arrow_down</i>}
				</span>
				<span className="-wmfl-title">{target.name}</span>
				<span className="-wmfl-option -wmfl-on-hover" title="Delete component" onClick={e => this.deleteTarget(e)}>
					<i className="material-icons">delete_outline</i>
				</span>
				<span className="-wmfl-option" title="Toggle visibility" onClick={e => this.toggleTargetVisibility(e)}>
					<i className="material-icons">{this.state.visible === false ? 'visibility_off' : 'visibility'}</i>
				</span>
			</div>
			<div className="wm-property-list-props">{children}</div>
		</div>;
	}
	mounted(dom) {
		dom.addEventListener('input', e => {
			if (!this.state.target) {
				return;
			}
			const name = (e.target.name || '').replace('wmprop-', '');
			const prop = name in this.state.target.props
				? this.state.target.props[name]
				: null;
			if (prop) {
				let value = (e.target.value || '').trim();
				if (e.target.type === 'checkbox') {
					value = e.target.checked;
				}
				this.setValue(name, value);
			}
		});
	}
	setValue(key, value) {
		const target = this.state.target;
		const prop = target.props[key];
		const convertedValue = typeof prop.filter === 'function'
			? prop.filter(value)
			: prop.type(value);
		target.state[key] = convertedValue;
		this.emit('input', target, prop, convertedValue);
	}
	toggleExpandedState(e) {
		this.state.expanded = !this.state.expanded;
	}
	toggleTargetVisibility(e) {
		e.stopPropagation();
		this.state.visible = !this.state.visible;
	}
	deleteTarget(e) {
		e.stopPropagation();
		this.emit('trash');
	}
}
