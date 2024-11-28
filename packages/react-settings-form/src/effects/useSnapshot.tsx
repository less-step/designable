import { Operation } from '@kep-platform/designable-core'
import { onFieldInputValueChange } from '@formily/core'

let timeRequest = null

export const useSnapshot = (operation: Operation) => {
	onFieldInputValueChange('*', () => {
		clearTimeout(timeRequest)
		timeRequest = setTimeout(() => {
			operation.snapshot('update:node:props')
		}, 1000)
	})
}
