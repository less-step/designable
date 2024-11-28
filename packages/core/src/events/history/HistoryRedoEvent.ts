import { ICustomEvent } from '@kep-platform/designable-shared'
import { AbstractHistoryEvent } from './AbstractHistoryEvent'

export class HistoryUndoEvent extends AbstractHistoryEvent implements ICustomEvent {
	type = 'history:undo'
}
