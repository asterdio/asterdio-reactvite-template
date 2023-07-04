import { FileTextOutlined, InboxOutlined } from '@ant-design/icons'

export interface MenuItem {
	key: string
	title: { zh_CN: string; en_US: string }
	icon?: React.ReactNode
	path?: string
	children?: MenuItem[]
	component?: React.ComponentType<any>
}

const MENU_CONFIG: MenuItem[] = [
	{
		key: '1',
		icon: FileTextOutlined,
		title: {
			zh_CN: 'Task',
			en_US: 'Task'
		},
		path: '/'
	}
]

export default MENU_CONFIG
