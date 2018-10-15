import map from 'lodash/map';
import Component from '../../base/Component';

export default class InspectorHeader extends Component {
	constructor(options) {
		super(options, {
			title: { type: String, default: 'Header title' },
			subtitle: { type: String },
			options: { type: Array }
		});
	}
	render() {
		const options = map(this.state.options, option => {
			return <a className="-wmfl-option" title={option.title} onClick={option.onClick}>
				<i className="material-icons">{option.icon}</i>
			</a>;
		});
		return <div className="wm-inspector-header -wm-flex">
			<span className="-wmfl-title">
				{this.state.title}
			</span>
			{this.state.subtitle ? <span className="-wmfl-label">{this.state.subtitle}</span> : null}
			{options}
		</div>;
	}
	mounted(dom) {
		this.dom = dom;

		// make shortcut methods
		// so we can remove later if needed
		this.onDragStartTarget = e => this.onDragStart(e);
		this.onDragMoveTarget = e => this.onDragMove(e);
		this.onDragEndTarget = e => this.onDragEnd(e);

		// bind methods
		// TODO: add touch support
		document.addEventListener('mousedown', this.onDragStartTarget);
		document.addEventListener('mousemove', this.onDragMoveTarget);
		document.addEventListener('mouseup', this.onDragEndTarget);
	}
	unmounted(dom) {
		// unbind previously bound methods
		document.removeEventListener('mousedown', this.onDragStartTarget);
		document.removeEventListener('mousemove', this.onDragMoveTarget);
		document.removeEventListener('mouseup', this.onDragEndTarget);
	}
	onDragStart(e) {
		if (e.target === this.dom) {
			this.dragStart = true;
			this.lastDragX = e.clientX;
			this.lastDragY = e.clientY;
		}
	}
	onDragMove(e) {
		if (this.dragStart) {
			const deltaX = this.lastDragX - e.clientX;
			const deltaY = this.lastDragY - e.clientY;
			this.emit('drag', deltaX, deltaY);
			this.lastDragX = e.clientX;
			this.lastDragY = e.clientY;
		}
	}
	onDragEnd(e) {
		if (this.dragStart) {
			this.dragStart = false;
			this.lastDragX = undefined;
			this.lastDragY = undefined;
			this.emit('dragstop');
		}
	}
}
