import { ICustomEvent } from '@kep-platform/shared'
import { AbstractKeyboardEvent } from './AbstractKeyboardEvent'

export class KeyDownEvent extends AbstractKeyboardEvent implements ICustomEvent {
	type = 'key:down'
}
