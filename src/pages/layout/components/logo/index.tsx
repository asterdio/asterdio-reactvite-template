import React from 'react'
import AntdSvg from '/antd.svg'
import '../../index.less'

interface Props {
	collapsed: boolean
}

const Index: React.FC<Props> = ({ collapsed }) => {
	return (
		<div className="logo" style={{ width: collapsed ? 80 : 200 }}>
			{collapsed ? (
				<span style={{ fontSize: '20px', fontWeight: 600, color: '#4298cd' }}>LT</span>
			) : (
				<span style={{ fontSize: '20px', fontWeight: 600, color: '#4298cd' }}>Log Tracker</span>
			)}
		</div>
	)
}

export default Index
