import Component from '../base/Component';

export default class ColumnGrid extends Component {
	constructor(options) {
		super(options, {
			columnNumber: { type: Number, default: 12 },
			gutterSize: { type: String, default: '10px' },
			gutterCompensation: { type: String, default: '10px' }
		});
	}
}
