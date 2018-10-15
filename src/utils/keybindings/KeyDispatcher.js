import filter from 'lodash/filter';
import uniq from 'lodash/uniq';
import Emitter from '../Emitter';

export default class KeyDispatcher extends Emitter {
	constructor() {
		super();

		// bind these methods, to preserve "this"
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);

		// bind straight away
		this.initialize();
	}
	initialize() {
		// bind to document
		document.addEventListener('keydown', this.onKeyDown);
		document.addEventListener('keypress', this.onKeyPress);
		document.addEventListener('keyup', this.onKeyUp);
	}
	destroy() {
		document.removeEventListener('keydown', this.onKeyDown);
		document.removeEventListener('keypress', this.onKeyPress);
		document.removeEventListener('keyup', this.onKeyUp);
	}
	onKeyDown(e) {
		const specific = this.getSpecificEvent('down', e);
		this.emit(specific, e);
		this.emit('down', e);
	}
	onKeyPress(e) {
		const specific = this.getSpecificEvent('press', e);
		this.emit(specific, e);
		this.emit('press', e);
	}
	onKeyUp(e) {
		const specific = this.getSpecificEvent('up', e);
		this.emit(specific, e);
		this.emit('up', e);
	}
	/**
	 * Returns the proper custom event name to fire.
	 * @param {String} name
	 * @param {KeyboardEvent} e
	 */
	getSpecificEvent(name, e) {
		const arr = [
			name,
			(e.ctrlKey ? 'control' : undefined),
			(e.altKey ? 'alt' : undefined),
			(e.metaKey ? 'meta' : undefined),
			(e.shiftKey ? 'shift' : undefined),
			('' + e.key).toLowerCase()
		];
		return uniq(filter(arr)).join(':');
	}
}
