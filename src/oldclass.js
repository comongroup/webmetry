/* eslint-disable */
export default function Webmetry(conf) {
	var self = this;
	self.currentLine = null;
	self.currentConfig = {};
	var overlay = null;

	var config = [
		{
			until:99999,
			params: {
				margin: "10px",
				columns: 12,
				gutters: "10px",
				edgeGutters: "10px",
				styles: {
					column: {
						hex: "#ff0000",
						opacity: 0.4
					},
					gutter: {
						hex: "#3300ff",
						opacity: 0.5
					},
					baseHangLine: {
						hex: "#ffffff",
						opacity: 0.9,
						thickness: "4px"
					}
				}
			}
		},
		{
			until:800,
			params: {
				margin: "10px",
				columns: 8,
				gutters: "10px",
				edgeGutters: "10px",
				styles: {
					column: {
						hex: "#ff0000",
						opacity: 0.4
					},
					gutter: {
						hex: "#3300ff",
						opacity: 0.5
					},
					baseHangLine: {
						hex: "#ffffff",
						opacity: 0.9,
						thickness: "4px"
					}
				}
			}
		}
	];

	function overrideConfig(override) {
		config = override;
	}

	if(conf)
		overrideConfig(conf);

	function renderGrid() {
		overlay = document.createElement("DIV");
		var grid = document.createElement("DIV");
		overlay.dataset.webmetryElement = "overlay";
		grid.dataset.webmetryElement = "grid";
		var os = overlay.style;
		var gs = grid.style;
		os.visibility = "collapse";
		os.position = "fixed";
		os.top = 0;os.left = 0;os.bottom = 0;os.right = 0;
		os.pointerEvents = "none";
		os.zIndex = Number.MAX_SAFE_INTEGER;
		gs.display = "flex";
		gs.position = "fixed";
		gs.top = 0;gs.left = 0;gs.bottom = 0;gs.right = 0;

		var w = window.innerWidth;
		// var h = window.innerHeight;
		for(var c=0;c<config.length;c++){
			self.currentConfig = config[c];
			if(w < self.currentConfig.until)
				break;
		}
		var p = self.currentConfig.params;

		gs.margin = p.margin;

		var createGutter = function(width) {
			var gutter = document.createElement("DIV");
			var gts = gutter.style;

			gts.flexGrow = 0;
			gts.flexShrink = 0;
			gts.backgroundColor = p.styles.gutter.hex;
			gts.opacity = p.styles.gutter.opacity;
			gts.width = width;

			return gutter;
		};

		for(c=1;c<=p.columns;c++) {

			if(p.edgeGutters){
				if(c==1)
					grid.appendChild(createGutter(p.edgeGutters));
			}

			var column = document.createElement("DIV");
			var cs = column.style;

			cs.flexGrow = 1;
			cs.backgroundColor = p.styles.column.hex;
			cs.opacity = p.styles.column.opacity;

			grid.appendChild(column);

			if(c==p.columns){
				if(p.edgeGutters){
					grid.appendChild(createGutter(p.edgeGutters));
				}
			}
			else{
				grid.appendChild(createGutter(p.gutters));
			}

		}

		overlay.appendChild(grid);
		document.body.appendChild(overlay);
	}

	self.addLine = function(vertical) {
		if(!vertical)
			vertical = false;
		var p = self.currentConfig.params;
		var w = window.innerWidth;
		var h = window.innerHeight;
		var baseHangLine = document.createElement("DIV");
		var bhls = baseHangLine.style;
		baseHangLine.classList.add(vertical ? "webmetry_vline" : "webmetry_hline");
		bhls.position = "fixed";
		if(vertical){
			bhls.top = 0;bhls.left = (w/2)+"px";bhls.bottom = 0;
			bhls.width = p.styles.baseHangLine.thickness;
		}
		else{
			bhls.left = 0;bhls.top = (h/2)+"px";bhls.right = 0;
			bhls.height = p.styles.baseHangLine.thickness;
		}
		bhls.backgroundColor = p.styles.baseHangLine.hex;
		bhls.opacity = p.styles.baseHangLine.opacity;
		bhls.pointerEvents = "all";

		baseHangLine.onmousedown = function(){
			self.currentLine = this;
		};

		document.onmousemove = function(e) {
			if(self.currentLine){
				e = e || window.event;
				var vertical = self.currentLine.classList.contains("webmetry_vline");
				var half = vertical ? self.currentLine.offsetWidth/2 : self.currentLine.offsetHeight/2;
				if(vertical)
					self.currentLine.style.left = (e.clientX - half) + "px";
				else
					self.currentLine.style.top = (e.clientY - half) + "px";
				self.currentLine.dataset.upperValue = (vertical ? e.clientX : e.clientY) - half;
				self.currentLine.dataset.lowerValue = (vertical ? e.clientX : e.clientY) + half;
			}
		};

		document.onmouseup = function() {
			self.currentLine = null;
		};

		overlay.appendChild(baseHangLine);
	};

	function init() {
		document.onkeydown = function(e) {
			var evtobj = window.event ? event : e;
			if (evtobj.shiftKey) {
				switch(evtobj.keyCode){
					case 86:
						self.addLine(true);
						break;

					case 71:
						if(overlay.style.visibility == "collapse")
							overlay.style.visibility = "visible";
						else
							overlay.style.visibility = "collapse";
						break;

					case 72:
						self.addLine(false);
						break;

					case 67:
						if(self.currentLine){
							self.currentLine.parentElement.removeChild(self.currentLine);
							self.currentLine = null;
						}
						break;
				}

			}
		};
		config.sort(function(a,b){
			if (a.until < b.until)
				return -1;
			if (a.until > b.until)
				return 1;
			return 0;
		});
		var ils = document.createElement("STYLE");
		ils.type = "text/css";
		ils.innerHTML = ".webmetry_vline,.webmetry_hline{user-select: none;} .webmetry_vline:after,.webmetry_vline:before,.webmetry_hline:after,.webmetry_hline:before{position:absolute;font-size:9px;font-family:monospace;} .webmetry_hline:after,.webmetry_hline:before{left:50%;} .webmetry_vline:after,.webmetry_vline:before{top:50%;} .webmetry_hline:after {content:attr(data-upper-value);transform: translate(-50%,-100%);} .webmetry_hline:before {content:attr(data-lower-value);margin-top:3px;transform: translate(-50%,0);} .webmetry_vline:after {content:attr(data-upper-value);transform: translate(-100%,-50%);} .webmetry_vline:before {content:attr(data-lower-value);transform: translate(0,-50%);}";
		document.body.appendChild(ils);
		renderGrid();
	}

	init();
}
