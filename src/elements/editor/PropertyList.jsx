import camelCase from 'lodash/camelCase';
import Component from '../../base/Component';
import renderPropEditor from '../../utils/editor/renderPropEditor';

export default class PropertyList extends Component {
	constructor(options) {
		super(options, {
			target: { type: Component, omit: true },
			expanded: { type: Boolean, default: true },
			visible: { type: Number, default: 2 }
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
				<span className="-wmfl-title">{target.getName()}</span>
				<span className="-wmfl-option -wmfl-on-hover" title="Delete component" onClick={e => this.trashTarget(e)}>
					<i className="material-icons">delete_outline</i>
				</span>
				<span className="-wmfl-option" title="Toggle visibility mode" onClick={e => this.toggleVisibilityMode(e)}>
					<i className="material-icons">
						{this.state.visible === 0
							? 'flash_off'
							: this.state.visible === 1
								? 'flash_on'
								: 'flash_auto'}
					</i>
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
		e.stopPropagation();
		this.state.expanded = !this.state.expanded;
	}
	toggleVisibilityMode(e) {
		e.stopPropagation();
		this.state.visible = (this.state.visible + 1) % 3;
	}
	trashTarget(e) {
		e.stopPropagation();
		this.emit('trash');
	}
}
