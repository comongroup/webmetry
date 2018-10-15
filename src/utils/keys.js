import KeyDispatcher from './keybindings/KeyDispatcher';

const dictionary = new KeyDispatcher();

export function checkInspectorOnKey(e, inspector, combo) {
	inspector.handler.components.forEach(component => {
		if ('keyToggle' in component.state && component.state.keyToggle === combo) {
			const propList = inspector.findCorrespondingPropList(component);
			if (propList) {
				propList.toggleVisibilityMode(e);
			}
		}
	});
}

export { dictionary };
