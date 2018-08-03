import { defaultsDeep, mapValues } from 'lodash';
import Emitter from '../utils/emitter';
import onChange from '../utils/onChange';

export default class WebmetryElement extends Emitter {
	constructor(options, props) {
		super();

		// props and state
		this.props = defaultsDeep(props || {}, {});
		this.state = defaultsDeep(options || {}, mapValues(this.props, (o) => {
			return o.default || undefined;
		}));

		// set observers
		this.state = onChange(this.state, (key, newValue, oldValue) => {
			this.emit('change:' + key, newValue, oldValue);
			this.emit('change', key, newValue, oldValue);
		});

		// self element and parent
		this.name = 'Element';
		this.element = null;
		this.parent = null;
	}
}
