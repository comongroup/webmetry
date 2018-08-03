import WebmetryElement from '../base/WebmetryElement';

export default class ColumnGrid extends WebmetryElement {
	constructor(options) {
		super(options, {
			columnNumber: { type: Number, default: 12 },
			gutterSize: { type: String, default: '10px' },
			gutterCompensation: { type: String, default: '10px' }
		});
	}
}
