import Component from '../base/Component';
import { keyProps } from '../utils/editor/keyUtils';
import { nameProps, renderComponentNameWithIcon } from '../utils/editor/nameUtils';
import { responsiveProps } from '../utils/editor/responsiveUtils';
import convertUnitToPx from '../utils/convertUnitToPx';

export default class LineGrid extends Component {
	constructor(options) {
		super(options, {
			...nameProps('LineGrid'),
			...keyProps('shift+l'),
			opacity: { type: Number, default: 0.25, picker: 'slider', range: [0, 1], step: 0.05, header: 'Main Properties' },
			originX: { type: String, default: '50%' },
			originY: { type: String, default: '0%' },
			horizontalLines: { type: Boolean, default: true, header: 'Horizontal Lines' },
			horizontalLineColor: { type: String, default: '#FFFFFF', picker: 'color' },
			horizontalLineColorOrigin: { type: String, default: '#FF0000', picker: 'color' },
			horizontalLineThickness: { type: String, default: '1px' },
			gapBetweenHorizontalLines: { type: String, default: '25px' },
			verticalLines: { type: Boolean, default: true, header: 'Vertical Lines' },
			verticalLineColor: { type: String, default: '#FFFFFF', picker: 'color' },
			verticalLineColorOrigin: { type: String, default: '#FF0000', picker: 'color' },
			verticalLineThickness: { type: String, default: '1px' },
			gapBetweenVerticalLines: { type: String, default: '25px' },
			fixed: { type: Boolean, default: false, header: 'Behaviour' },
			...responsiveProps()
		}, renderComponentNameWithIcon('grid_on', 'LineGrid'));
	}
	render() {
		let containerClasses = 'wm-line-grid';
		if (this.state.fixed) {
			containerClasses += ' fixed';
		}
		let containerStyles = {
			opacity: this.state.opacity
		};
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
		const pixelRatio = 1; // TODO: transform into variable
		const rect = this.canvas.getBoundingClientRect();
		const width = this.canvas.width = rect.width * pixelRatio;
		const height = this.canvas.height = rect.height * pixelRatio;

		const ctx = this.canvas.getContext('2d');
		ctx.globalAlpha = 1;
		ctx.clearRect(0, 0, width, height);

		if (this.state.verticalLines) {
			const thickness = Math.max(1, convertUnitToPx(this.state.verticalLineThickness, 'width')) * pixelRatio;
			const gap = convertUnitToPx(this.state.gapBetweenVerticalLines, 'width') * pixelRatio;

			// calc position (with offsets cause of origin)
			const origin = convertUnitToPx(this.state.originX, 'width', this.state.fixed ? 'fixed' : 'absolute') * pixelRatio;
			const affect = (origin / width - 0.5) * -2; // how much to offset, to make edge lines available if origin not middle
			const start = origin + affect * (thickness / 2);
			let x = start;
			let dir = thickness + gap;

			// draw now
			ctx.strokeStyle = this.state.verticalLineColorOrigin;
			ctx.lineWidth = thickness;
			while (x >= 0 && x <= width) {
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, height);
				ctx.stroke();
				ctx.strokeStyle = this.state.verticalLineColor;
				x += dir;
				if (x >= width) {
					dir *= -1;
					x = start + dir;
				}
			}
		}

		if (this.state.horizontalLines) {
			const thickness = Math.max(1, convertUnitToPx(this.state.horizontalLineThickness, 'height')) * pixelRatio;
			const gap = convertUnitToPx(this.state.gapBetweenHorizontalLines, 'height') * pixelRatio;

			// calc position (with offsets cause of origin)
			const origin = convertUnitToPx(this.state.originY, 'height', this.state.fixed ? 'fixed' : 'absolute') * pixelRatio;
			const affect = (origin / height - 0.5) * -2; // how much to offset, to make edge lines available if origin not middle
			const start = origin + affect * (thickness / 2);
			let y = start;
			let dir = thickness + gap;

			// draw now
			ctx.strokeStyle = this.state.horizontalLineColorOrigin;
			ctx.lineWidth = thickness;
			while (y >= 0 && y <= height) {
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(width, y);
				ctx.stroke();
				ctx.strokeStyle = this.state.horizontalLineColor;
				y += dir;
				if (y >= height) {
					dir *= -1;
					y = start + dir;
				}
			}
		}
	}
}
