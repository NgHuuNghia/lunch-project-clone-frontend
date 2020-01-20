import React from 'react'
import { Spin } from 'antd'

const Loading = () => {
	return ( 
		<div
			style={{
				textAlign: 'center',
				borderRadius: '4px',
				marginBottom: '20px',
				padding: '30px 50px',
				margin: '20px 0'
			}}
		>
			<Spin size="large" />
		</div>
	 );
}
 
export default Loading;
