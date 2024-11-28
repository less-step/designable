import { ICustomEvent } from '@kep-platform/shared'
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent'

export class PrependNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
	type = 'prepend:node'
}
