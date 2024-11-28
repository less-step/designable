import { usePrefix } from '@designable/react'
import { observer } from '@formily/reactive-react'
import React, { ReactNode } from 'react'
import styled from 'styled-components'

export interface IHeaderProps {
	extra: ReactNode | null
	title: ReactNode | string
}

const HeaderContainer = styled.div`
	display: flex;
	flex: none;
	align-items: center;
	justify-content: space-between;
	height: 40px;
	padding: 8px 12px 9px;
	border-bottom: 1px solid #eee;
	border-radius: 2px 2px 0 0;
`

export const Header: React.FC<IHeaderProps> = observer(({ extra, title }) => {
	const prefix = usePrefix('data-source-setter')
	return (
		<HeaderContainer>
			<div className={`${prefix + '-layout-item-title'}`}>{title}</div>
			{extra}
		</HeaderContainer>
	)
})
