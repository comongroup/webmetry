import Component from '../../base/Component';

export default class InspectorDialog extends Component {
	constructor(options) {
		super(options, {
			title: { type: String, default: 'Dialog title' },
			items: { type: Array }
		});
	}
	render() {
		const children = [];
		for (let i = 0; i < this.state.items.length; i++) {
			const item = this.state.items[i];
			if (item.header) {
				children.push(<li className="wm-inspector-dialog-list-header">{item.header}</li>);
			}
			children.push(
				<li className="wm-inspector-dialog-list-item" onClick={e => this.emit('select', item, e, this)}>
					{item.title}
				</li>
			);
		}
		return <div className="wm-inspector-dialog">
			<div className="wm-inspector-dialog-header -wm-flex">
				<span className="-wmfl-title">{this.state.title}</span>
				<a className="-wmfl-option" title="Close" onClick={() => this.emit('close')}>
					<i className="material-icons">close</i>
				</a>
			</div>
			<ul className="wm-inspector-dialog-list">
				{children}
			</ul>
		</div>;
	}
}
