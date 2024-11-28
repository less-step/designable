import { ICustomEvent } from '@kep-platform/designable-shared'
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent'

export class CloneNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
	type = 'clone:node'
}
