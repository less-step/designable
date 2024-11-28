import React from 'react'
import { Content } from './content'
import { renderSandboxContent } from '@kep-platform/designable-react-sandbox'
import './theme.less'

renderSandboxContent(() => {
	return <Content />
})
