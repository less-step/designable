import { GlobalRegistry } from '@designable/core'
import { IconWidget, TextWidget } from '@designable/react'
import { observer } from '@formily/reactive-react'
import { uid } from '@formily/shared'
import { Button, Tree, TreeProps } from 'antd'
import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Header } from './Header'
import { traverseTree } from './shared'
import { Title } from './Title'
import { INodeItem, ITreeDataSource } from './types'

const limitTreeDrag = ({ dropPosition }) => {
	if (dropPosition === 0) {
		return false
	}
	return true
}

export interface ITreePanelProps {
	treeDataSource: ITreeDataSource
	allowTree: boolean
	defaultOptionValue: {
		label: string
		value: any
	}[]
}

const ContentContainer = styled.div`
	padding: 2%;
	height: 300px;
	max-height: 300px;
	overflow: scroll;
`

export const TreePanel: React.FC<ITreePanelProps> = observer((props) => {
	const dropHandler = (info: Parameters<TreeProps['onDrop']>[0]) => {
		const dropKey = info.node?.key
		const dragKey = info.dragNode?.key
		const dropPos = info.node.pos.split('-')
		const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
		const data = [...props.treeDataSource.dataSource]
		// Find dragObject
		let dragObj: INodeItem
		traverseTree(data, (item, index, arr) => {
			if (arr[index].key === dragKey) {
				arr.splice(index, 1)
				dragObj = item
			}
		})
		if (!info.dropToGap) {
			traverseTree(data, (item) => {
				if (item.key === dropKey) {
					item.children = item.children || []
					item.children.unshift(dragObj)
				}
			})
		} else if ((info.node.children || []).length > 0 && info.node.expanded && dropPosition === 1) {
			traverseTree(data, (item) => {
				if (item.key === dropKey) {
					item.children = item.children || []
					item.children.unshift(dragObj)
				}
			})
		} else {
			let ar: any[]
			let i: number
			traverseTree(data, (item, index, arr) => {
				if (item.key === dropKey) {
					ar = arr
					i = index
				}
			})
			if (dropPosition === -1) {
				ar.splice(i, 0, dragObj)
			} else {
				ar.splice(i + 1, 0, dragObj)
			}
		}
		props.treeDataSource.dataSource = data
	}
	return (
		<Fragment>
			<Header
				title={<TextWidget token="SettingComponents.DataSourceSetter.dataSourceTree" />}
				extra={
					<Button
						type="text"
						onClick={() => {
							const uuid = uid()
							const dataSource = props.treeDataSource.dataSource
							const initialKeyValuePairs = props.defaultOptionValue?.map((item) => ({ ...item })) || [
								{
									label: 'label',
									value: `${GlobalRegistry.getDesignerMessage(`SettingComponents.DataSourceSetter.item`)} ${dataSource.length + 1}`,
								},
								{ label: 'value', value: uuid },
							]
							props.treeDataSource.dataSource = dataSource.concat({
								key: uuid,
								duplicateKey: uuid,
								map: initialKeyValuePairs,
								children: [],
							})
						}}
						icon={<IconWidget infer="Add" />}
					>
						<TextWidget token="SettingComponents.DataSourceSetter.addNode" />
					</Button>
				}
			/>
			<ContentContainer>
				<Tree
					blockNode
					draggable={true}
					allowDrop={props.allowTree ? () => true : limitTreeDrag}
					defaultExpandAll
					defaultExpandParent
					autoExpandParent
					showLine={{ showLeafIcon: false }}
					treeData={props.treeDataSource.dataSource}
					onDragEnter={() => {}}
					onDrop={dropHandler}
					titleRender={(titleProps: INodeItem) => {
						return <Title {...titleProps} treeDataSource={props.treeDataSource}></Title>
					}}
					onSelect={(selectedKeys) => {
						if (selectedKeys[0]) {
							props.treeDataSource.selectedKey = selectedKeys[0].toString()
						}
					}}
				></Tree>
			</ContentContainer>
		</Fragment>
	)
})
