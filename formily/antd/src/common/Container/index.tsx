import React, { ReactNode } from 'react'
import { observer } from '@formily/reactive-react'
import { DroppableWidget } from '@kep-platform/react'
import './styles.less'

export const Container: React.FC<{ children: ReactNode }> = observer((props) => {
	return <DroppableWidget>{props.children}</DroppableWidget>
})

export const withContainer = (Target: React.JSXElementConstructor<any>) => {
	return (props: any) => {
		return (
			<DroppableWidget>
				<Target {...props} />
			</DroppableWidget>
		)
	}
}
