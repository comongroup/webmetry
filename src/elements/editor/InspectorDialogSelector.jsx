import Component from '../../base/Component';

export default class InspectorDialogSelector extends Component {
	constructor(options) {
		super(options, {
			showing: { type: Boolean, default: false },
			title: { type: String, default: 'Dialog title' }
		});
	}
	render() {
		const children = [];
		for (let i = 0; i < this.state.components.length; i++) {
			const item = this.state.components[i];
			children.push(<li onClick={() => this.emit('select', item.c)}>{item.title}</li>);
		}
		return <div className={`wm-inspector-dialog-selector${this.state.showing ? ' -wm-showing' : ''}`}>
			<div className="wm-inspector-dialog-selector-header -wm-flex">
				<span className="-wmfl-title">{this.state.title}</span>
				<span className="-wmfl-option" title="Close dialog" onClick={() => this.hide()}>
					<i className="material-icons">close</i>
				</span>
			</div>
			<ul className="wm-inspector-dialog-selector-list">
				{children}
			</ul>
		</div>;
	}
	show() {
		this.state.showing = true;
	}
	hide() {
		this.state.showing = false;
	}
}
