import Component from '../base/Component';
import renderIcon from '../utils/editor/renderIcon';

export default class ColumnGrid extends Component {
	constructor(options) {
		super(options, {
			columnColorEven: { type: String, default: '#000088', picker: 'color' },
			columnColorOdd: { type: String, default: '#000080', picker: 'color' },
			columnNumber: { type: Number, default: 12 },
			edgeGutterColor: { type: String, default: '#3300ff', picker: 'color' },
			edgeGutterSize: { type: String, default: '10px' },
			midGutterColor: { type: String, default: '#3300ff', picker: 'color' },
			midGutterSize: { type: String, default: '10px' },
			margin: { type: String, default: '10px' },
			opacity: { type: Number, default: 0.25, picker: 'slider', range: [0, 1], step: 0.05 }
		}, renderIcon('view_column', 'ColumnGrid'));
	}
	render() {
		const children = [];
		const total = this.state.columnNumber;
		for (let i = 0; i < total; i++) {
			if (i === 0) {
				children.push(this.renderChild('wm-gutter -first', this.state.edgeGutterSize, this.state.edgeGutterColor));
			}
			children.push(this.renderChild('wm-column', null, (i + 1) % 2 === 0
				? this.state.columnColorEven
				: this.state.columnColorOdd));
			children.push(i === total - 1
				? this.renderChild('wm-gutter -last', this.state.edgeGutterSize, this.state.edgeGutterColor)
				: this.renderChild('wm-gutter', this.state.midGutterSize, this.state.midGutterColor));
		}
		const style = {
			margin: this.state.margin,
			opacity: this.state.opacity
		};
		return <div className="wm-column-grid" style={style}>{children}</div>;
	}
	renderChild(className, width, color) {
		const style = {
			width: width || undefined,
			backgroundColor: color || undefined
		};
		return <div className={className} style={style}></div>;
	}
}
