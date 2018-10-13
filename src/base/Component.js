import defaultsDeep from 'lodash/defaultsDeep';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';
import diffObject from '../utils/diffObject';
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
		this.serialize = delta => this.internalSerialize(state, delta);
		this.unserialize = data => this.internalUnserialize(state, data);

		// observe state
		this.state = observeObject(state, (key, newValue, oldValue) => {
			this.emit('change:' + key, newValue, oldValue);
			this.emit('change', key, newValue, oldValue);
		});

		// getters
		this.getProps = () => props;
	}
	render() {}
	rendered(dom) {}
	mounted(dom) {}
	unmounted(dom) {}
	internalSerialize(state, delta) {
		// return the state of the object,
		// but filter out keys that are not props,
		// or values that equal the default (if delta == true)
		return pickBy(state, (v, k) => {
			const prop = this.props[k];
			return prop && !prop.omit && (delta !== true || prop.default !== v);
		});
	}
	internalUnserialize(state, data) {
		const diff = diffObject(state, data);

		// call change events for props that are being removed,
		// but only remove from object if it's not a prop that needs serialization later
		diff.removed.forEach(key => {
			const oldValue = state[key];
			if (this.props[key]) {
				state[key] = undefined;
			}
			else {
				delete state[key];
			}
			this.emit('change:' + key, undefined, oldValue);
		});

		// call change events for props that are being added or changed
		diff.updated.forEach(key => {
			const oldValue = state[key];
			const newValue = data[key];
			state[key] = newValue;
			this.emit('change:' + key, newValue, oldValue);
		});

		// call global change event
		this.emit('change');
	}
}
