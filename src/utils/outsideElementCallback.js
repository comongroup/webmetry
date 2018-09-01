/**
 * Returns an event handler that checks whether a click event occurred
 * inside or outside the specified `element`, and calls the provided
 * `callback`.
 * @param {HTMLElement} element Element to check against.
 * @param {Function} callback Method to call when clicking outside `element`.
 */
export default function outsideElementCallback(element, callback) {
	return e => {
		let target = e.target;

		do {
			// check if target is same,
			// if so, cancel the function
			if (target === element) {
				return;
			}

			// go up the DOM
			target = target.parentNode;
		} while (target);

		// clicked outside
		callback();
	};
}
