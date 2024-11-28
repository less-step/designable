import { ICustomEvent } from '@kep-platform/shared'
import { AbstractWorkspaceEvent } from './AbstractWorkspaceEvent'

export class RemoveWorkspaceEvent extends AbstractWorkspaceEvent implements ICustomEvent {
	type = 'remove:workspace'
}
