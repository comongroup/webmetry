import renderIcon from './utils/editor/renderIcon';

// ALL COMPONENT IMPORTS AND REGISTERS GO BELOW!
// these will be used by the dialog selector and the import/export utilities
import ColumnGrid from './elements/ColumnGrid';

export default function bindComponents(repo) {
	repo.register('ColumnGrid', renderIcon('view_column', 'ColumnGrid'), ColumnGrid);
}
