import Component from '../base/Component';
import { nameProps, renderComponentNameWithIcon } from '../utils/editor/nameUtils';
import { responsiveProps } from '../utils/editor/responsiveUtils';

export default class ColumnGrid extends Component {
	constructor(options) {
		super(options, {
			...nameProps('ColumnGrid'),
			columnNumber: { type: Number, default: 12, header: 'Main Properties' },
			columnColorEven: { type: String, default: '#000088', picker: 'color' },
			columnColorOdd: { type: String, default: '#000080', picker: 'color' },
			opacity: { type: Number, default: 0.25, picker: 'slider', range: [0, 1], step: 0.05 },
			margin: { type: String, default: '0px auto' },
			maxWidth: { type: String, default: 'none' },
			showGutters: { type: Boolean, default: true, header: 'Gutters' },
			edgeGutterColor: { type: String, default: '#3300ff', picker: 'color' },
			edgeGutterSize: { type: String, default: '10px' },
			midGutterColor: { type: String, default: '#3300ff', picker: 'color' },
			midGutterSize: { type: String, default: '10px' },
			...responsiveProps()
		}, renderComponentNameWithIcon('view_column', 'ColumnGrid'));
	}
	render() {
		const children = [];
		const total = this.state.columnNumber;
		for (let i = 0; i < total; i++) {
			if (i === 0) {
				children.push(this.renderEdgeGutter('first'));
			}
			children.push(
				this.renderChild(
					'wm-column',
					null,
					(i + 1) % 2 === 0
						? this.state.columnColorEven
						: this.state.columnColorOdd
				)
			);
			children.push(
				i === total - 1
					? this.renderEdgeGutter('last')
					: this.renderMidGutter()
			);
		}
		const style = {
			margin: this.state.margin,
			maxWidth: this.state.maxWidth,
			opacity: this.state.opacity
		};
		return <div className="wm-column-grid" style={style}>{children}</div>;
	}
	renderEdgeGutter(additionalClass) {
		return this.renderChild(
			`wm-gutter -${additionalClass}`,
			this.state.edgeGutterSize,
			this.state.edgeGutterColor,
			this.state.showGutters || false
		);
	}
	renderMidGutter() {
		return this.renderChild(
			`wm-gutter`,
			this.state.midGutterSize,
			this.state.midGutterColor,
			this.state.showGutters || false
		);
	}
	renderChild(className, width, color, show) {
		const style = {
			backgroundColor: color || undefined,
			opacity: show === false ? 0 : 1,
			width: width || undefined
		};
		return <div className={className} style={style}></div>;
	}
}
