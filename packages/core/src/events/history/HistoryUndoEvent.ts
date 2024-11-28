import { ICustomEvent } from '@kep-platform/designable-shared'
import { AbstractHistoryEvent } from './AbstractHistoryEvent'

export class HistoryRedoEvent extends AbstractHistoryEvent implements ICustomEvent {
	type = 'history:redo'
}
