import { ICustomEvent } from '@kep-platform/designable-shared'
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent'

export class SelectNodeEvent extends AbstractMutationNodeEvent implements ICustomEvent {
	type = 'user:select:node'
}
