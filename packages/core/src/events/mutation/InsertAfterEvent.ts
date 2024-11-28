import { ICustomEvent } from '@kep-platform/designable-shared'
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent'

export class InsertAfterEvent extends AbstractMutationNodeEvent implements ICustomEvent {
	type = 'insert:after'
}
