import { GlobalRegistry, IDesignerRegistry } from '@kep-platform/core'
import { globalThisPolyfill } from '@kep-platform/shared'

export const useRegistry = (): IDesignerRegistry => {
	return globalThisPolyfill['__DESIGNER_REGISTRY__'] || GlobalRegistry
}
