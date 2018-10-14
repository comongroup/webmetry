import Component from '../base/Component';
import { nameProps, renderComponentNameWithIcon } from '../utils/editor/nameUtils';
import { responsiveProps } from '../utils/editor/responsiveUtils';

export default class LineGrid extends Component {
	constructor(options) {
		super(options, {
			...nameProps('LineGrid'),
			opacity: { type: Number, default: 0.25, picker: 'slider', range: [0, 1], step: 0.05, header: 'Main Properties' },
			horizontalLines: { type: Boolean, default: true, header: 'Horizontal Lines' },
			horizontalGapSize: { type: String, default: '25px' },
			horizontalLineColor: { type: String, default: '#FFFFFF', picker: 'color' },
			verticalLines: { type: Boolean, default: true, header: 'Vertical Lines' },
			verticalGapSize: { type: String, default: '25px' },
			verticalLineColor: { type: String, default: '#FFFFFF', picker: 'color' },
			fixed: { type: Boolean, default: true, header: 'Behaviour' },
			...responsiveProps()
		}, renderComponentNameWithIcon('view_headline', 'LineGrid'));
	}
	render() {
		let containerClasses = 'wm-line-grid';
		if (this.state.fixed) {
			containerClasses += ' fixed';
		}
		let containerStyles = {
			opacity: this.state.opacity
		};

		if (!this.state.fixed) {
			containerStyles.height = document.documentElement.offsetHeight;
		}

		return <canvas className={containerClasses} style={containerStyles}></canvas>;
	}
	rendered(dom) {
		if (this.canvas) {
			this.updateCanvas();
		}
	}
	mounted(dom) {
		this.canvas = dom;
		this.updateCanvas();
	}
	updateCanvas() {
		let gapSizes = [this.state.horizontalGapSize, this.state.verticalGapSize];
		let gsTgts = [0, 0];
		for (let s = 0; s < gapSizes.length; s++) {
			let dummy = document.createElement('DIV');
			dummy.style.height = gapSizes[s];
			dummy.style.width = '1px';
			document.body.appendChild(dummy);
			gsTgts[s] = Math.max(0.5, dummy.getBoundingClientRect().height);
			dummy.remove();
		}

		this.canvas.style.top = 0;
		this.canvas.style.left = 0;
		this.canvas.style.right = 0;
		this.canvas.width = document.documentElement.clientWidth - 1;
		this.canvas.height = this.state.fixed ? window.innerHeight : document.documentElement.offsetHeight;
		this.canvas.style.width = this.canvas.width + 'px';
		this.canvas.style.height = this.canvas.height + 'px';

		let ctx = this.canvas.getContext('2d');
		ctx.globalAlpha = 1;
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.lineWidth = 1;
		ctx.translate(0.5, 0.5);
		if (this.state.verticalLines) {
			ctx.strokeStyle = this.state.verticalLineColor;
			for (let x = 0; x <= this.canvas.width; x += gsTgts[0]) {
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, this.canvas.height);
				ctx.stroke();
			}
		}
		if (this.state.horizontalLines) {
			ctx.strokeStyle = this.state.horizontalLineColor;
			for (let y = 0; y <= this.canvas.height; y += gsTgts[1]) {
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(this.canvas.width, y);
				ctx.stroke();
			}
		}
	}
}
