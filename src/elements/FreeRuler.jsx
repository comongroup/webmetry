import Component from '../base/Component';
import { nameProps, renderComponentNameWithIcon } from '../utils/editor/nameUtils';
import { responsiveProps } from '../utils/editor/responsiveUtils';

export default class FreeRuler extends Component {
	constructor(options) {
		super(options, {
			...nameProps('FreeRuler'),
			gridSize: { type: Number, default: 10, header: 'Main Properties' },
			snapToGrid: { type: Boolean, default: true },
			axisLength: { type: Number, default: 50 },
			distance: { type: Boolean, default: true, header: 'Distance Label' },
			distanceColor: { type: String, default: '#FFFFFF', picker: 'color' },
			distanceOpacity: { type: Number, default: 1, picker: 'slider', range: [0, 1], step: 0.05 },
			angle: { type: Boolean, default: true, header: 'Angle Label' },
			angleColor: { type: String, default: '#FFFFFF', picker: 'color' },
			angleOpacity: { type: Number, default: 1, picker: 'slider', range: [0, 1], step: 0.05 },
			handles: { type: Boolean, default: true, header: 'Handles' },
			handlerColor: { type: String, default: '#AA2222', picker: 'color' },
			ruler: { type: Boolean, default: true, header: 'Ruler' },
			rulerColor: { type: String, default: '#FFFFFF', picker: 'color' },
			rulerOpacity: { type: Number, default: 1, picker: 'slider', range: [0, 1], step: 0.05 },
			fixedAxis: { type: Boolean, default: false, header: 'Fixed Axis' },
			fixedAxisColor: { type: String, default: '#00FF00', picker: 'color' },
			fixedAxisOpacity: { type: Number, default: 1, picker: 'slider', range: [0, 1], step: 0.05 },
			orientedAxis: { type: Boolean, default: true, header: 'Oriented Axis' },
			orientedAxisColor: { type: String, default: '#FF2222', picker: 'color' },
			orientedAxisOpacity: { type: Number, default: 1, picker: 'slider', range: [0, 1], step: 0.05 },
			fixedFullAxis: { type: Boolean, default: true, header: 'Fixed Full Axis' },
			fixedFullAxisColor: { type: String, default: '#FFFFFF', picker: 'color' },
			fixedFullAxisOpacity: { type: Number, default: 1, picker: 'slider', range: [0, 1], step: 0.05 },
			...responsiveProps()
		}, renderComponentNameWithIcon('straighten', 'FreeRuler'));
	}
	render() {
		const hdlStyle = {
			backgroundColor: this.state.handlerColor,
			opacity: this.state.handles ? 1 : 0
		};

		return <div className="wm-free-ruler">
			<canvas></canvas>
			<div style={hdlStyle}></div>
			<div style={hdlStyle}></div>
			<div style={hdlStyle}></div>
		</div>;
	}
	rendered(dom) {
		if (this.canvas) {
			this.updateCanvas();
		}
	}
	mounted(dom) {
		this.midHandler = dom.querySelectorAll('div')[0];
		this.handler01 = dom.querySelectorAll('div')[1];
		this.handler02 = dom.querySelectorAll('div')[2];
		this.canvas = dom.querySelector('canvas');
		this.grabbedHandler = null;
		this.offsets = { c01: { x: 0, y: 0 }, c02: { x: 0, y: 0 } };

		let hdlS = this.handler01.getBoundingClientRect().width / 2;

		this.handler01.style.left = ((document.documentElement.clientWidth / 2) - hdlS - 150) + 'px';
		this.handler02.style.left = ((document.documentElement.clientWidth / 2) - hdlS + 150) + 'px';
		this.midHandler.style.left = ((document.documentElement.clientWidth / 2) - hdlS) + 'px';

		this.handler01.style.top = ((document.documentElement.clientHeight / 2) - hdlS - 150) + 'px';
		this.handler02.style.top = ((document.documentElement.clientHeight / 2) - hdlS + 150) + 'px';
		this.midHandler.style.top = ((document.documentElement.clientHeight / 2) - hdlS) + 'px';

		document.addEventListener('mousedown', e => this.handlerPressed(e));
		document.addEventListener('mousedown', e => this.handlerPressed(e));
		document.addEventListener('mouseup', e => this.handlerReleased(e));
		document.addEventListener('mouseup', e => this.handlerReleased(e));
		document.addEventListener('mousemove', e => this.moving(e));

		this.updateCanvas();
	}
	handlerPressed(e) {
		if (e.target === this.handler01 || e.target === this.handler02) {
			this.grabbedHandler = e.target;
		}
		if (e.target === this.midHandler) {
			let hdl01Rect = this.handler01.getBoundingClientRect();
			let hdl02Rect = this.handler02.getBoundingClientRect();
			let midRect = this.midHandler.getBoundingClientRect();

			this.offsets.c01 = { x: midRect.left - hdl01Rect.left, y: midRect.top - hdl01Rect.top };
			this.offsets.c02 = { x: midRect.left - hdl02Rect.left, y: midRect.top - hdl02Rect.top };

			this.grabbedHandler = e.target;
		}
	}
	handlerReleased() {
		this.grabbedHandler = null;
	}
	moving(e) {
		if (this.grabbedHandler != null) {
			let rect = this.grabbedHandler.getBoundingClientRect();
			let y = e.clientY - rect.height / 2;
			let x = e.clientX - rect.width / 2;

			if (this.state.snapToGrid) {
				x = Math.round(x / this.state.gridSize) * this.state.gridSize;
				y = Math.round(y / this.state.gridSize) * this.state.gridSize;
			}

			this.grabbedHandler.style.top = y + 'px';
			this.grabbedHandler.style.left = x + 'px';
			if (this.grabbedHandler === this.midHandler) {
				this.handler01.style.top = (y - this.offsets.c01.y) + 'px';
				this.handler01.style.left = (x - this.offsets.c01.x) + 'px';
				this.handler02.style.top = (y - this.offsets.c02.y) + 'px';
				this.handler02.style.left = (x - this.offsets.c02.x) + 'px';
			}
			else {
				let hdl01Rect = this.handler01.getBoundingClientRect();
				let hdl02Rect = this.handler02.getBoundingClientRect();
				this.midHandler.style.left =
					Math.min(hdl01Rect.left, hdl02Rect.left) +
					Math.abs((hdl01Rect.left - hdl02Rect.left) / 2) + 'px';
				this.midHandler.style.top =
					Math.min(hdl01Rect.top, hdl02Rect.top) +
					Math.abs((hdl01Rect.top - hdl02Rect.top) / 2) + 'px';
			}
			this.updateCanvas();
		}
	}
	updateCanvas() {
		let hdl01Rect = this.handler01.getBoundingClientRect();
		let hdl02Rect = this.handler02.getBoundingClientRect();
		let hdSH = hdl01Rect.width / 2;
		let c01 = { x: hdl01Rect.left + hdSH, y: hdl01Rect.top + hdSH };
		let c02 = { x: hdl02Rect.left + hdSH, y: hdl02Rect.top + hdSH };

		this.canvas.style.top = 0;
		this.canvas.style.left = 0;
		this.canvas.width = document.documentElement.clientWidth - 1;
		this.canvas.height = document.documentElement.clientHeight - 1;
		this.canvas.style.width = this.canvas.width + 'px';
		this.canvas.style.height = this.canvas.height + 'px';

		let angleTo2 = {
			rad: Math.atan2(c02.y - c01.y, c02.x - c01.x),
			deg: Math.atan2(c02.y - c01.y, c02.x - c01.x) * 180 / Math.PI
		};

		let angleTo1 = {
			rad: Math.atan2(c01.y - c02.y, c01.x - c02.x),
			deg: Math.atan2(c01.y - c02.y, c01.x - c02.x) * 180 / Math.PI
		};

		let dist = Math.sqrt(Math.pow(c01.x - c02.x, 2) + Math.pow(c01.y - c02.y, 2));

		let ctx = this.canvas.getContext('2d');
		ctx.globalAlpha = 1;
		ctx.imageSmoothingEnabled = true;
		ctx.translate(0.5, 0.5);
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		if (this.state.ruler) {
			ctx.globalAlpha = this.state.rulerOpacity;
			ctx.strokeStyle = this.state.rulerColor;
			ctx.beginPath();
			ctx.moveTo(c01.x, c01.y);
			ctx.lineTo(c02.x, c02.y);
			ctx.stroke();
		}

		if (this.state.fixedFullAxis) {
			ctx.globalAlpha = this.state.fixedFullAxisOpacity;
			ctx.beginPath();
			ctx.strokeStyle = this.state.fixedFullAxisColor;
			ctx.moveTo(0, c01.y);
			ctx.lineTo(window.innerWidth, c01.y);
			ctx.moveTo(c01.x, 0);
			ctx.lineTo(c01.x, window.innerHeight);

			ctx.moveTo(0, c02.y);
			ctx.lineTo(window.innerWidth, c02.y);
			ctx.moveTo(c02.x, 0);
			ctx.lineTo(c02.x, window.innerHeight);
			ctx.stroke();
		}

		if (this.state.fixedAxis) {
			ctx.globalAlpha = this.state.fixedAxisOpacity;
			ctx.beginPath();
			ctx.strokeStyle = this.state.fixedAxisColor;
			ctx.moveTo(c01.x - this.state.axisLength, c01.y);
			ctx.lineTo(c01.x + this.state.axisLength, c01.y);
			ctx.moveTo(c01.x, c01.y - this.state.axisLength);
			ctx.lineTo(c01.x, c01.y + this.state.axisLength);

			ctx.moveTo(c02.x - this.state.axisLength, c02.y);
			ctx.lineTo(c02.x + this.state.axisLength, c02.y);
			ctx.moveTo(c02.x, c02.y - this.state.axisLength);
			ctx.lineTo(c02.x, c02.y + this.state.axisLength);
			ctx.stroke();
		}

		let ang = angleTo2.rad;

		if (this.state.orientedAxis) {
			ctx.globalAlpha = this.state.orientedAxisOpacity;
			ctx.beginPath();
			ctx.strokeStyle = this.state.orientedAxisColor;
			ang = angleTo2.rad;
			ctx.moveTo(c01.x, c01.y);
			ctx.lineTo(c01.x - (Math.cos(ang) * this.state.axisLength), c01.y - (Math.sin(ang) * this.state.axisLength));

			ang = angleTo2.rad + (Math.PI / 2);
			ctx.moveTo(c01.x, c01.y);
			ctx.lineTo(c01.x - (Math.cos(ang) * this.state.axisLength), c01.y - (Math.sin(ang) * this.state.axisLength));

			ang = angleTo2.rad - (Math.PI / 2);
			ctx.moveTo(c01.x, c01.y);
			ctx.lineTo(c01.x - (Math.cos(ang) * this.state.axisLength), c01.y - (Math.sin(ang) * this.state.axisLength));
			ctx.stroke();

			ctx.beginPath();
			ang = angleTo1.rad;
			ctx.moveTo(c02.x, c02.y);
			ctx.lineTo(c02.x - (Math.cos(ang) * this.state.axisLength), c02.y - (Math.sin(ang) * this.state.axisLength));

			ang = angleTo1.rad + (Math.PI / 2);
			ctx.moveTo(c02.x, c02.y);
			ctx.lineTo(c02.x - (Math.cos(ang) * this.state.axisLength), c02.y - (Math.sin(ang) * this.state.axisLength));

			ang = angleTo1.rad - (Math.PI / 2);
			ctx.moveTo(c02.x, c02.y);
			ctx.lineTo(c02.x - (Math.cos(ang) * this.state.axisLength), c02.y - (Math.sin(ang) * this.state.axisLength));
			ctx.stroke();
		}

		if (this.state.angle) {
			ctx.globalAlpha = this.state.angleOpacity;
			ctx.save();
			ang = angleTo2.rad;
			ctx.translate(c02.x - (Math.cos(ang) * (dist / 2)), c02.y - (Math.sin(ang) * (dist / 2)));
			ctx.rotate((angleTo2.deg > 90 || angleTo2.deg < -90) ? (ang + Math.PI) : ang);
			ctx.textAlign = 'center';
			ctx.fillStyle = this.state.angleColor;
			ctx.fillText(
				Math.abs((Math.round(angleTo2.deg * 10) / 10)) +
				'º  (' +
				Math.abs((Math.round(angleTo2.rad * 100) / 100)) +
				' rad)', 0, -10);
			ctx.restore();
		}

		if (this.state.distance) {
			ctx.globalAlpha = this.state.distanceOpacity;
			ctx.save();
			ang = angleTo2.rad;
			ctx.translate(c02.x - (Math.cos(ang) * (dist / 2)), c02.y - (Math.sin(ang) * (dist / 2)));
			ctx.rotate((angleTo2.deg > 90 || angleTo2.deg < -90) ? (ang + Math.PI) : ang);
			ctx.textAlign = 'center';
			ctx.fillStyle = this.state.distanceColor;
			ctx.fillText(Math.abs((Math.round(dist * 10) / 10)) + ' px', 0, 15);
			ctx.restore();
		}
	}
}
