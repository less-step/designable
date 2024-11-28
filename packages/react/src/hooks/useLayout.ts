import { useContext } from 'react'
import { DesignerLayoutContext } from '../context'
import { IDesignerLayoutContext } from '../types'
import { globalThisPolyfill } from '@kep-platform/shared'

export const useLayout = (): IDesignerLayoutContext => {
	return globalThisPolyfill['__DESIGNABLE_LAYOUT__'] || useContext(DesignerLayoutContext)
}
