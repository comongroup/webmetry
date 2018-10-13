import map from 'lodash/map';

export default class ComponentRepository {
	constructor() {
		this.entries = {};
	}
	register(key, title, ctor) {
		this.entries[key] = { title, ctor };
	}
	getList() {
		return map(this.entries, entry => {
			return {
				title: entry.title,
				result: entry.ctor
			};
		});
	}
}
