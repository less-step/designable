import React, { ReactNode } from 'react'
import { observer } from '@formily/reactive-react'
import { useWorkbench } from '../hooks'
import { Workspace } from './Workspace'

export const Workbench: React.FC<{ children: ReactNode }> = observer((props) => {
	const workbench = useWorkbench()
	return <Workspace id={workbench.currentWorkspace?.id}>{props.children}</Workspace>
})
