import { GlobalRegistry, IDesignerRegistry } from '@kep-platform/designable-core'
import { globalThisPolyfill } from '@kep-platform/designable-shared'

export const useRegistry = (): IDesignerRegistry => {
	return globalThisPolyfill['__DESIGNER_REGISTRY__'] || GlobalRegistry
}
