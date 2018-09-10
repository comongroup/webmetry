import { map } from 'lodash';

export default class ComponentRepository {
	constructor() {
		this.entries = {};
	}
	register(key, title, ctor) {
		this.entries[key] = { title, ctor };
	}
	getList() {
		return map(this.entries, entry => {
			return entry;
		});
	}
}
