import Component from '../base/Component';
import renderIcon from '../utils/editor/renderIcon';
import { responsiveProps } from '../utils/editor/responsiveUtils';

export default class FreeRuler extends Component {
	constructor(options) {
		super(options, {
			...responsiveProps()
		}, renderIcon('straighten', 'Free Ruler'));
	}
	render() {
		return <div className="wm-free-ruler">free ruler goes here!</div>;
	}
}
