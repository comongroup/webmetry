import renderIcon from './utils/editor/renderIcon';

// ALL COMPONENT IMPORTS AND REGISTERS GO BELOW!
// these will be used by the dialog selector and the import/export utilities
import ColumnGrid from './elements/ColumnGrid';
import BaseLines from './elements/BaseLines';
import FreeRuler from './elements/FreeRuler';

export default function bindComponents(repo) {
	repo.register('ColumnGrid', renderIcon('view_column', 'ColumnGrid'), ColumnGrid);
	repo.register('BaseLines', renderIcon('view_headline', 'BaseLines'), BaseLines);
	repo.register('FreeRuler', renderIcon('straighten', 'FreeRuler'), FreeRuler);
}
