import React, { useState, useEffect } from 'react'
import { Menu } from 'antd'
import menus, { MenuItem } from './config'
import { useNavigate, useLocation } from 'react-router-dom'
import useStore from '@src/stores/headerTag'
import useUserStore from '@src/stores/user'
import union from 'lodash/union'
import { icons } from 'antd/lib/image/PreviewGroup'

const { SubMenu } = Menu

function renderIcon(icon: any) {
	if (!icon) {
		return null
	}
	return icon.render()
}

function findMenuByPath(menus: MenuItem[], path: string, keys: any[]): any {
	for (const menu of menus) {
		if (menu.path === path) {
			return [...keys, menu.key]
		}
		if (menu.children && menu.children.length > 0) {
			const result = findMenuByPath(menu.children, path, [...keys, menu.key])
			if (result.length === 0) {
				continue
			}
			return result
		}
	}
	return []
}

const SideMenu: React.FC = () => {
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const [openKeys, setOpenkeys] = useState<string[]>([])
	const [selectedKeys, setSelectedKeys] = useState<string[]>([])
	const locale = useUserStore((state) => state.locale)
	const addTag = useStore((state) => state.addTag)

	// 首次进入时，默认选择第一项
	useEffect(() => {
		if (menus[0].children) {
			const { key, icon, path, title } = menus[0].children[0]
			addTag({
				path: path as string,
				label: title,
				id: key,
				closable: false
			})
		}
	}, [])

	// setSelectedKeys 和 path 双向绑定
	useEffect(() => {
		const keys: string[] = findMenuByPath(menus, location.pathname, [])
		if (keys) {
			setSelectedKeys([keys.pop() as string])
			setOpenkeys(union(openKeys, keys))
		}
	}, [pathname])

	// 点击 MenuItem
	function handleMenuClick(menu: MenuItem) {
		if (menu.path === pathname) return
		const { key, path, icon, title } = menu
		addTag({
			path: path as string,
			label: title,
			id: key,
			closable: true
		})
		navigate(menu.path as string)
	}

	// 展开一个Menu
	function handleOpenChange(keys: any) {
		setOpenkeys(keys)
	}

	function renderMenu(menus: MenuItem[]) {
		if (menus.length === 0) {
			return null
		}
		return menus.map((menu) => {
			if (menu.children) {
				return (
					<SubMenu
						key={menu.key}
						title={
							<>
								{renderIcon(menu.icon)}
								<span>{menu.title[locale]}</span>
							</>
						}
					>
						{renderMenu(menu.children)}
					</SubMenu>
				)
			}
			return (
				<Menu.Item key={menu.key} title={menu.title[locale]} onClick={() => handleMenuClick(menu)}>
					<>
						{renderIcon(menu.icon)} <span>{menu.title[locale]}</span>
					</>
				</Menu.Item>
			)
		})
	}

	return (
		<Menu
			mode="inline"
			theme="light"
			openKeys={openKeys}
			selectedKeys={selectedKeys}
			onOpenChange={handleOpenChange as any}
		>
			{renderMenu(menus)}
		</Menu>
	)
}

export default SideMenu
