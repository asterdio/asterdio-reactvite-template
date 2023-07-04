import React, { lazy, FC } from 'react'
import { PartialRouteObject } from 'react-router'
import WrapperRouteComponent from './config'
import { useRoutes } from 'react-router-dom'
import LoginPage from '@pages/login'
import LayoutPage from '@pages/layout'
import SignupForm from '@src/pages/signup'

const NotFound = lazy(() => import('@pages/not-found'))
const Task = lazy(() => import('@pages/tasks'))



const routeList: PartialRouteObject[] = [
	{
		path: '/login',
		element: <WrapperRouteComponent element={<LoginPage />} titleId="login" />
	},
	{
		path: '/signup',
		element: <WrapperRouteComponent element={<SignupForm />} titleId="signup" />
	},
	{
		path: '/',
		element: <WrapperRouteComponent element={<LayoutPage />} titleId="layout" auth />,
		children: [
			{
				element: <WrapperRouteComponent element={<Task />} titleId="Log Tracker" auth />
			}
		]
	},
	{
		// Error page route
		path: '*',
		element: <WrapperRouteComponent element={<NotFound />} titleId="not-found" />
	}
]

const RenderRouter: FC = () => {
	const element = useRoutes(routeList)
	return element
}

export default RenderRouter
