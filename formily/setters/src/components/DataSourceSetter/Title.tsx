import { IconWidget, TextWidget } from '@designable/react'
import { observer } from '@formily/reactive-react'
import { clone, toArr } from '@formily/shared'
import React from 'react'
import styled from 'styled-components'
import { traverseTree } from './shared'
import { INodeItem, ITreeDataSource } from './types'
export interface ITitleProps extends INodeItem {
	treeDataSource: ITreeDataSource
}

const TitleContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;

	& > .title-icon {
		transition: all 0.15s ease-in-out;
		opacity: 0;

		&:hover {
			color: #1890ff;
		}
	}
`

export const Title: React.FC<ITitleProps> = observer((props) => {
	const getTitleValue = (dataSource) => {
		const optionalKeys = ['label', 'title', 'header']
		let nodeTitle: string
		optionalKeys.some((key) => {
			const title = toArr(dataSource).find((item) => item.label === key)?.value
			if (title !== undefined) {
				nodeTitle = title
				return true
			}
			return false
		})
		if (nodeTitle === undefined) {
			toArr(dataSource || []).some((item) => {
				if (item.value && typeof item.value === 'string') {
					nodeTitle = item.value
					return true
				}
				return false
			})
		}
		return nodeTitle
	}

	const renderTitle = (dataSource) => {
		const nodeTitle = getTitleValue(dataSource)
		if (nodeTitle === undefined) return <TextWidget token="SettingComponents.DataSourceSetter.defaultTitle" />
		else return nodeTitle + ''
	}

	return (
		<TitleContainer>
			<span style={{ marginRight: '5px' }}>{renderTitle(props?.map || [])}</span>
			<IconWidget
				className=".title-icon"
				infer="Remove"
				onClick={() => {
					const newDataSource = clone(props?.treeDataSource?.dataSource)
					traverseTree(newDataSource || [], (dataItem, i, data) => {
						if (data[i].key === props.duplicateKey) toArr(data).splice(i, 1)
					})
					props.treeDataSource.dataSource = newDataSource
				}}
			/>
		</TitleContainer>
	)
})
