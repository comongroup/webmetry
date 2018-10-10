import Component from '../../base/Component';

export default class InspectorDialog extends Component {
	constructor(options) {
		super(options, {
			title: { type: String, default: 'Dialog title' }
		});
	}
	render() {
		const children = [];
		for (let i = 0; i < this.state.items.length; i++) {
			const item = this.state.items[i];
			children.push(<li onClick={e => this.emit('select', item.result, e, this)}>{item.title}</li>);
		}
		return <div className="wm-inspector-dialog">
			<div className="wm-inspector-dialog-header -wm-flex">
				<span className="-wmfl-title">{this.state.title}</span>
				<span className="-wmfl-option" title="Close" onClick={() => this.emit('close')}>
					<i className="material-icons">close</i>
				</span>
			</div>
			<ul className="wm-inspector-dialog-list">
				{children}
			</ul>
		</div>;
	}
}
