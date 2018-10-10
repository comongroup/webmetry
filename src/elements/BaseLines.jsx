import Component from '../base/Component';
import renderIcon from '../utils/editor/renderIcon';
import { responsiveProps } from '../utils/editor/responsiveUtils';

export default class BaseLines extends Component {
	constructor(options) {
		super(options, {
			gapSize: { type: String, default: '25px', header: 'Main Properties' },
			lineColor: { type: String, default: '#FFFFFF', picker: 'color' },
			lineThickness: { type: String, default: '1px' },
			opacity: { type: Number, default: 0.25, picker: 'slider', range: [0, 1], step: 0.05 },
			margin: { type: String, default: '0px auto' },
			fixed: { type: Boolean, default: true, header: 'Behaviour' },
			...responsiveProps()
		}, renderIcon('view_headline', 'BaseLines'));
	}
	render() {
		const children = [];

		let heightTests = [this.state.gapSize, this.state.lineThickness];
		let heights = [0, 0];

		heightTests.forEach((h, i) => {
			let dummy = document.createElement('DIV');
			dummy.style.height = h;
			dummy.style.width = '1px';
			document.body.appendChild(dummy);
			heights[i] = dummy.offsetHeight;
			dummy.remove();
		});

		let lineCount = ((this.state.fixed) ? window.innerHeight : document.documentElement.offsetHeight) / (heights[0] + heights[1]);

		for (let l = 1; l <= Math.ceil(lineCount); l++) {
			children.push(this.line());
			children.push(this.gap());
		}

		let containerClasses = 'wm-baselines';
		if (this.state.fixed) {
			containerClasses += ' fixed';
		}
		let containerStyles = {
			opacity: this.state.opacity,
			margin: this.state.margin
		};

		return <div className={containerClasses} style={containerStyles}>{children}</div>;
	}
	line() {
		const style = {
			height: this.state.lineThickness,
			backgroundColor: this.state.lineColor
		};
		return <div className="line" style={style}></div>;
	}
	gap() {
		const style = {
			height: this.state.gapSize
		};
		return <div className="gap" style={style}></div>;
	}
}
