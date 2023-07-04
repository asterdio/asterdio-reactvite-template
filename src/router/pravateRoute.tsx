import React, { FC } from 'react'
import { Route, Navigate } from 'react-router-dom'
import { RouteProps, useLocation } from 'react-router'
import useStore from '@src/stores/user'
import Cookies from 'js-cookie'

const PrivateRoute: FC<RouteProps> = (props) => {
	const location = useLocation()
	const logged = useStore((state) => state.logged)
	const cookieValue = Cookies.get('auth')

	let myObject

	if (cookieValue) {
		myObject = JSON.parse(cookieValue)
	}
	return myObject?.status ? (
		<Route {...props} />
	) : (
		<Navigate to={{ pathname: `/login${'?from=' + encodeURIComponent(location.pathname)}` }} replace />
	)
}

export default PrivateRoute
