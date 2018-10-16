import map from 'lodash/map';

export default class ComponentRepository {
	constructor() {
		this.entries = {};
	}
	register(key, title, Constructor) {
		this.entries[key] = { title, Constructor };
	}
	grab(key) {
		return this.entries[key];
	}
	getList() {
		return map(this.entries, (entry, key) => {
			return {
				key: key,
				...entry
			};
		});
	}
}
