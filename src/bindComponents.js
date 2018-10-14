import renderIcon from './utils/editor/renderIcon';

// ALL COMPONENT IMPORTS AND REGISTERS GO BELOW!
// these will be used by the dialog selector and the import/export utilities
import ColumnGrid from './elements/ColumnGrid';
import LineGrid from './elements/LineGrid';
import FreeRuler from './elements/FreeRuler';

export default function bindComponents(repo) {
	repo.register('ColumnGrid', renderIcon('view_column', 'ColumnGrid'), ColumnGrid);
	repo.register('LineGrid', renderIcon('view_headline', 'LineGrid'), LineGrid);
	repo.register('FreeRuler', renderIcon('straighten', 'FreeRuler'), FreeRuler);
}
