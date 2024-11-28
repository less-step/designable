import { ICustomEvent } from '@kep-platform/designable-shared'
import { AbstractHistoryEvent } from './AbstractHistoryEvent'

export class HistoryPushEvent extends AbstractHistoryEvent implements ICustomEvent {
	type = 'history:push'
}
