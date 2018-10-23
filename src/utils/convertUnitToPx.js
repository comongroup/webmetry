const dummyElement = document.createElement('div');
dummyElement.style.width = '1px';
dummyElement.style.height = '1px';
dummyElement.style.opacity = 0;

function resetElement() {
	dummyElement.style.width = '1px';
	dummyElement.style.height = '1px';
}

export { dummyElement };

// TODO: HEAVILY OPTIMIZE THIS
export default function convertUnitToPx(str, prop = 'height', pos = 'absolute') {
	dummyElement.style.position = pos;
	dummyElement.style[prop] = str;
	document.body.appendChild(dummyElement);
	const result = Math.max(0, dummyElement.getBoundingClientRect()[prop]);
	dummyElement.remove();
	resetElement();
	return result;
}
