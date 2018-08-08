import { defaultsDeep, mapValues } from 'lodash';
import Emitter from '../utils/Emitter';
import observeObject from '../utils/observeObject';

export default class Component extends Emitter {
	constructor(options, props) {
		super();

		// props
		props = defaultsDeep(props || {}, {});

		// state
		const state = defaultsDeep(options || {}, mapValues(this.props, (o) => {
			return o.default || undefined;
		}));

		// observe state
		this.state = observeObject(state, (key, newValue, oldValue) => {
			this.emit('change:' + key, newValue, oldValue);
			this.emit('change', key, newValue, oldValue);
		});

		// getters
		this.getProps = () => props;
	}
}
