import React from 'react'
import { createRoot } from 'react-dom/client'
import { DataSourceSetter } from './components'
import { IDataSourceItem } from './components/DataSourceSetter/types'
let root = createRoot(document.getElementById('root'))
root.render(
	<DataSourceSetter
		onChange={function (dataSource: IDataSourceItem[]): void {
			// eslint-disable-next-line no-console
			console.log(dataSource)
		}}
		value={[]}
	/>
)
