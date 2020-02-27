import React from 'react'
import { Button } from 'antd'

function Actions({
	data,
    onEdit,
	onDelete,
}) {
	return (
		<div className="site-actions">
			<Button
				type='primary'
				className="site-action-button"
				onClick={() => onEdit(data._id)}
				name="btnEditSite"
				style={{margin:'2px 10px', height:'24px', width: '70px', padding:'2px 10px'}}
			>
				Edit
			</Button>

			<Button
				type='danger'
				className="site-action-button"
				onClick={() => {
					onDelete(data._id)
				}}
				name="btnDeleteSite"
				style={{margin:'2px 10px', height:'24px', width: '70px', padding:'2px 10px'}}
			>
				Delete
			</Button>
		</div>
	)
}

export default Actions
