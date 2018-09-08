import { defaultsDeep, mapValues } from 'lodash';
import Emitter from '../utils/Emitter';
import observeObject from '../utils/observeObject';

export default class Component extends Emitter {
	constructor(options, props, name) {
		super();

		// name handling
		name = name || this.constructor.name;
		this.getName = () => typeof name === 'function'
			? name(this)
			: name;

		// props (public so the editor can access them)
		this.props = defaultsDeep(props || {}, {});

		// state
		const state = defaultsDeep(options || {}, mapValues(this.props, o => o.default || undefined));

		// observe state
		this.state = observeObject(state, (key, newValue, oldValue) => {
			this.emit('change:' + key, newValue, oldValue);
			this.emit('change', key, newValue, oldValue);
		});

		// getters
		this.getProps = () => props;
	}
	render() {}
	mounted(dom) {}
	unmounted(dom) {}
}
