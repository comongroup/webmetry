import filter from 'lodash/filter';
import pull from 'lodash/pull';
import uniq from 'lodash/uniq';
import Emitter from '../Emitter';

export default class KeyDispatcher extends Emitter {
	constructor() {
		super();

		// bind these methods, to preserve "this"
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);

		// create key buffer
		this.buffer = [];

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
	dispatch(name, e) {
		const combo = this.getComboString(e);
		const buffer = [ ...this.buffer ];
		this.emit(name + ':' + combo, e, { combo, buffer });
		this.emit(name, e, { combo, buffer });
	}
	onKeyDown(e) {
		const char = this.getChar(e);
		if (this.buffer.indexOf(char) === -1) {
			this.buffer.push(char);
		}
		this.dispatch('down', e);
	}
	onKeyPress(e) {
		this.dispatch('press', e);
	}
	onKeyUp(e) {
		const char = this.getChar(e);
		pull(this.buffer, char);
		this.dispatch('up', e);
	}
	/**
	 * Processes and returns the character.
	 * @param {KeyboardEvent} e
	 */
	getChar(e) {
		return ('' + e.key).toLowerCase();
	}
	/**
	 * Processes and returns the key combo string, with modifiers.
	 * @param {KeyboardEvent} e
	 */
	getComboString(e) {
		const arr = [
			(e.ctrlKey ? 'control' : undefined),
			(e.altKey ? 'alt' : undefined),
			(e.metaKey ? 'meta' : undefined),
			(e.shiftKey ? 'shift' : undefined),
			this.getChar(e)
		];
		return uniq(filter(arr)).join(':');
	}
}
