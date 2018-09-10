const isNew = (prev, next) => key => prev[key] !== next[key];
const isGone = next => key => !(key in next);

/**
 * Performs a shallow comparison between two objects,
 * and returns an object containing arrays of keys mentioning what has changed.
 * @param {Object} prevState
 * @param {Object} nextState
 * @returns {Object}
 */
export default function diffObject(prevState, nextState) {
	const removed = [];
	const updated = [];

	// cache predicates for filtering functions
	const isGoneNow = isGone(nextState);
	const isNewNow = isNew(prevState, nextState);

	// remove old unnecessary attributes
	Object.keys(prevState)
		.filter(isGoneNow)
		.forEach(key => {
			removed.push(key);
		});

	// check new or changed attributes
	Object.keys(nextState)
		.filter(isNewNow)
		.forEach(key => {
			updated.push(key);
		});

	return { removed, updated };
}
