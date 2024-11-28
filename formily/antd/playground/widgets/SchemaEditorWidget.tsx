import React from 'react'
import { transformToSchema, transformToTreeNode } from '@kep-platform/formily-transformer'
import { TreeNode, ITreeNode } from '@kep-platform/core'
import { MonacoInput } from '@kep-platform/react-settings-form'

export interface ISchemaEditorWidgetProps {
	tree: TreeNode
	onChange?: (tree: ITreeNode) => void
}

export const SchemaEditorWidget: React.FC<ISchemaEditorWidgetProps> = (props) => {
	return (
		<MonacoInput
			{...props}
			value={JSON.stringify(transformToSchema(props.tree), null, 2)}
			onChange={(value) => {
				props.onChange?.(transformToTreeNode(JSON.parse(value)))
			}}
			language="json"
		/>
	)
}
