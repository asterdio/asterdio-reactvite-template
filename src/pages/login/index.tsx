import React, { FC } from 'react'
import axios from 'axios'
import { Button, Form, Input } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import useStore from '@src/stores/user'
import { useLocale } from '@src/locales'
import './index.less'
import PocketBase from 'pocketbase'
import Cookies from 'js-cookie'

type LoginParams = {
	email: string
	password: string
}

const LoginForm: FC = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const { formatMessage } = useLocale()
	const login = useStore((state) => state.login)
	const pb = new PocketBase('https://pocketbase-logtracker.asterdio.xyz')
	const onFinished = async (form: LoginParams) => {
		const { email, password } = form
		const authData = await pb.collection('users').authWithPassword(email, password)

		if (authData) {
			const { token, record } = authData
			const authObject = { token, name: record?.name, status: true }
			Cookies.set('auth', JSON.stringify(authObject))
			navigate('/')
		}
	}

	return (
		<div className="login-page">
			<Form onFinish={onFinished} className="login-page-form">
				<h2 className="form-title">{formatMessage({ id: 'login.submit' })}</h2>
				<Form.Item
					name="email"
					rules={[
						{ required: true, message: formatMessage({ id: 'login.username.message' }) },
						{
							type: 'email',
							message: 'Please enter a valid email address!'
						}
					]}
				>
					<Input placeholder="Enter your email" />
				</Form.Item>
				<Form.Item
					name="password"
					rules={[{ required: true, message: formatMessage({ id: 'login.password.message' }) }]}
				>
					<Input type="password" placeholder={formatMessage({ id: 'login.password' })} />
				</Form.Item>
				<Form.Item>
					<Button htmlType="submit" type="primary" className="login-page-form_button">
						{formatMessage({ id: 'login.submit' })}
					</Button>
				</Form.Item>
				<h4>
					Need an acoount? <a>SIGN UP</a>
				</h4>
			</Form>
		</div>
	)
}

export default LoginForm
