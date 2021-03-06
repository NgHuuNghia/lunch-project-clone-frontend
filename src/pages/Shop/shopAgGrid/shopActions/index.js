import React, { useState } from 'react'
import { Button, Modal, Icon } from 'antd'

function Actions({
	data,
	onEdit,
	onDelete,
	onViewListDish
}) {


	const [visible, setVisible] = useState(false)

	const showModal = () => {
		setVisible(true)
	};

	const handleOk = () => {
		onDelete(data._id)
		setVisible(false)
	};

	const handleCancel = () => {
		setVisible(false)
	};
	return (
		<div className="shop-actions">
			<Button
				type='primary'
				className="shop-action-button"
				name="btnEditShop"
				onClick={() => {
					onEdit(data._id)
				}}
				style={{ margin: '2px 10px', height: '24px', width: '70px', padding: '2px 10px' }}
			>
				Edit
			</Button>

			<Button
				onClick={() => {onViewListDish(data._id) }}
				type='primary'
				className="shop-action-button"
				name="btnOpenListDish"
				style={{ margin: '2px 10px', height: '24px', width: '100px', padding: '2px 10px' }}
			>
				List Dishs
			</Button>

			<Button
				onClick={showModal}
				type='danger'
				className="shop-action-button"
				name="btnDeleteShop"
				style={{ margin: '2px 10px', height: '24px', width: '70px', padding: '2px 10px' }}
			>
				Delete
			</Button>

			<Modal
				width={300}
				cancelText='No'
				okText='Yes'
				okType='danger'
				visible={visible}
				onOk={handleOk}
				onCancel={handleCancel}
				centered={true}
			>
				<div style={{ padding: 10, display: 'flex' }}>
					<Icon type='warning' theme="filled" style={{ color: 'red', fontSize: 35 }} />
					<span style={{ margin: '10px 0 0 12px' }}> Do you want to delete ?</span>
				</div>
			</Modal>
		</div>
	)
}

export default Actions
