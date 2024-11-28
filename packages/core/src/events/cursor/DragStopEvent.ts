import { ICustomEvent } from '@kep-platform/designable-shared'
import { AbstractCursorEvent } from './AbstractCursorEvent'

export class DragStopEvent extends AbstractCursorEvent implements ICustomEvent {
	type = 'drag:stop'
}
