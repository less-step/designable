import { ICustomEvent } from '@kep-platform/shared'
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent'

export class InsertBeforeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
	type = 'insert:before'
}
