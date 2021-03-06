// based off of component-emitter package
// https://github.com/component/emitter

export default class Emitter {
	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 */
	on(event, fn) {
		this._callbacks = this._callbacks || {};
		(this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);
		return this;
	}
	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 */
	once(event, fn) {
		function on() {
			this.off(event, on);
			fn.apply(this, arguments);
		}
		on.fn = fn;
		this.on(event, on);
		return this;
	}
	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 */
	off(event, fn) {
		this._callbacks = this._callbacks || {};

		// all
		if (arguments.length === 0) {
			this._callbacks = {};
			return this;
		}

		// specific event
		var callbacks = this._callbacks['$' + event];
		if (!callbacks) return this;

		// remove all handlers
		if (arguments.length === 1) {
			delete this._callbacks['$' + event];
			return this;
		}

		// remove specific handler
		var cb;
		for (var i = 0; i < callbacks.length; i++) {
			cb = callbacks[i];
			if (cb === fn || cb.fn === fn) {
				callbacks.splice(i, 1);
				break;
			}
		}

		// Remove event specific arrays for event types that no
		// one is subscribed for to avoid memory leak.
		if (callbacks.length === 0) {
			delete this._callbacks['$' + event];
		}

		return this;
	}
	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 */
	emit(event) {
		this._callbacks = this._callbacks || {};
		const args = [].slice.call(arguments, 1);
		let callbacks = this._callbacks['$' + event];

		if (callbacks) {
			callbacks = callbacks.slice(0);
			for (var i = 0, len = callbacks.length; i < len; ++i) {
				callbacks[i].apply(this, args);
			}
		}

		return this;
	}
	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 */
	listeners(event) {
		this._callbacks = this._callbacks || {};
		return this._callbacks['$' + event] || [];
	}
	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 */
	hasListeners(event) {
		return !!this.listeners(event).length;
	}
}
