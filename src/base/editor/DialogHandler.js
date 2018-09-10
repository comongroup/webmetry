import ComponentHandler from '../ComponentHandler';
import InspectorDialog from '../../elements/editor/InspectorDialog';
import outsideElementCallback from '../../utils/outsideElementCallback';

export default class DialogHandler extends ComponentHandler {
	spawnDialog(options) {
		const dialog = new InspectorDialog(options);
		const handler = () => this.dismissDialog(dialog);
		dialog.on('select', handler);
		dialog.on('close', handler);
		this.add(dialog);
		setTimeout(() => {
			dialog.hideCallback = outsideElementCallback(dialog.instance.dom, handler);
			document.addEventListener('click', dialog.hideCallback);
		}, 1);
		return dialog;
	}
	dismissDialog(dialog) {
		document.removeEventListener('click', dialog.hideCallback);
		this.remove(dialog);
	}
}
