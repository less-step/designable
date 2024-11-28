import { ICustomEvent } from '@kep-platform/shared'
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent'

export class HoverNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
	type = 'hover:node'
}
