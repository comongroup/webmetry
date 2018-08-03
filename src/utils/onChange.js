// based off of es6 guide
// https://blog.revathskumar.com/2016/02/es6-observe-change-in-object-using-proxy.html

export default function onChange(object, callback) {
	const handler = {
		set(target, key, value) {
			const oldValue = target[key];
			const changed = target[key] !== value;
			target[key] = value;
			if (changed) {
				callback(key, value, oldValue);
			}
		},
		deleteProperty(target, key) {
			const oldValue = target[key];
			delete target[key];
			callback(key, undefined, oldValue);
		}
	};
	return new Proxy(object, handler);
}
