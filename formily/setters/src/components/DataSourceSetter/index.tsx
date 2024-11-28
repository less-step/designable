import { TextWidget } from '@designable/react'
import { Form } from '@formily/core'
import { observable } from '@formily/reactive'
import { observer } from '@formily/reactive-react'
import { Button, Modal } from 'antd'
import React, { Fragment, useMemo, useState } from 'react'
import styled from 'styled-components'
import { DataSettingPanel } from './DataSettingPanel'
import { TreePanel } from './TreePanel'
import { transformDataToValue, transformValueToData } from './shared'
import { IDataSourceItem, ITreeDataSource } from './types'
export interface IDataSourceSetterProps {
	className?: string
	style?: React.CSSProperties
	onChange: (dataSource: IDataSourceItem[]) => void
	value: IDataSourceItem[]
	allowTree?: boolean
	allowExtendOption?: boolean
	defaultOptionValue?: {
		label: string
		value: any
	}[]
	effects?: (form: Form<any>) => void
}

const DataSourceSetterContainer = styled.div`
	::-webkit-scrollbar {
		width: 5px;
		height: 5px;
	}

	::-webkit-scrollbar-thumb {
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 0;
		transition: all 0.25s ease-in-out;
	}

	::-webkit-scrollbar-thumb:hover {
		background-color: rgba(0, 0, 0, 0.3);
	}
	display: flex;
	justify-content: space-around;
	border: 1px solid #eee;
	border-radius: 3px;
	.antd-tree-treenode {
		padding-right: 10px;
		white-space: nowrap;

		&:hover {
			.dn-data-source-setter-node-title-icon {
				opacity: 1;
			}
		}
	}
`
const DataSourceSetterContainerItem = styled.div`
	position: relative;
	&.left {
		width: 40%;
		border-right: 1px solid #eee;
	}
	&.right {
		width: 60%;
	}
`
export const DataSourceSetter: React.FC<IDataSourceSetterProps> = observer((props) => {
	const { className, value = [], onChange, allowTree = true, allowExtendOption = true, defaultOptionValue, effects = () => {} } = props
	const [modalVisible, setModalVisible] = useState(false)
	const treeDataSource: ITreeDataSource = useMemo(
		() =>
			observable({
				dataSource: transformValueToData(value),
				selectedKey: '',
			}),
		[value, modalVisible]
	)
	const openModal = () => setModalVisible(true)
	const closeModal = () => setModalVisible(false)
	return (
		<Fragment>
			<Button onClick={openModal}>
				<TextWidget token="SettingComponents.DataSourceSetter.configureDataSource" />
			</Button>
			<Modal
				title={<TextWidget token="SettingComponents.DataSourceSetter.configureDataSource" />}
				width="65%"
				bodyProps={{ style: { padding: '12px' } }}
				transitionName=""
				maskTransitionName=""
				open={modalVisible}
				onCancel={closeModal}
				onOk={() => {
					onChange(transformDataToValue(treeDataSource.dataSource))
					closeModal()
				}}
			>
				<DataSourceSetterContainer className={className}>
					<DataSourceSetterContainerItem className="left">
						<TreePanel defaultOptionValue={defaultOptionValue} allowTree={allowTree} treeDataSource={treeDataSource}></TreePanel>
					</DataSourceSetterContainerItem>
					<DataSourceSetterContainerItem className="right">
						<DataSettingPanel allowExtendOption={allowExtendOption} treeDataSource={treeDataSource} effects={effects}></DataSettingPanel>
					</DataSourceSetterContainerItem>
				</DataSourceSetterContainer>
			</Modal>
		</Fragment>
	)
})
