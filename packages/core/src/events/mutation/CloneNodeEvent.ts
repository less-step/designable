import { ICustomEvent } from '@kep-platform/shared'
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent'

export class CloneNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
	type = 'clone:node'
}
