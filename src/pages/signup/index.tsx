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
	name: string
	email: string
	password: string
	conform_password: string
}

const SignupForm: FC = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const { formatMessage } = useLocale()
	const login = useStore((state) => state.login)
	const pb = new PocketBase('https://pocketbase-logtracker.asterdio.xyz')

	function modifyName(name: string) {
		const firstName = name.split(' ')[0]
		return firstName + Math.floor(Math.random() * 10000)
	}
	const onFinished = async (form: LoginParams) => {
		const { name, email, password, conform_password } = form

		const data = {
			username: modifyName(name),
			email: email,
			emailVisibility: true,
			password: password,
			passwordConfirm: conform_password,
			name: name
		}

		const record = await pb.collection('users').create(data)
		if (record) {
			const authData = await pb.collection('users').authWithPassword(email, password)
			if (authData) {
				const { token, record } = authData
				const authObject = { token, name: record?.name, status: true }
				Cookies.set('auth', JSON.stringify(authObject))
				navigate('/')
			}
		}
	}

	const validateAsterdioEmail = (_: any, value: any) => {
		if (!value || value.endsWith('@asterdio.com')) {
			return Promise.resolve()
		}
		return Promise.reject(new Error('Email must end with @asterdio.com'))
	}

	return (
		<div className="login-page">
			<Form onFinish={onFinished} className="login-page-form">
				<h2 className="form-title">sign up</h2>

				<Form.Item name="name" rules={[{ required: true, message: formatMessage({ id: 'login.username.message' }) }]}>
					<Input placeholder="Enter your name" />
				</Form.Item>
				<Form.Item
					name="email"
					rules={[
						{ required: true, message: formatMessage({ id: 'login.username.message' }) },
						{
							type: 'email',
							message: 'Please enter a valid email address!'
						},
						{ validator: validateAsterdioEmail }
					]}
				>
					<Input placeholder="Enter your email" />
				</Form.Item>
				<Form.Item name="password" rules={[{ required: true, message: 'Please enter password' }]}>
					<Input type="password" placeholder={formatMessage({ id: 'login.password' })} />
				</Form.Item>
				<Form.Item name="conform_password" rules={[{ required: true, message: 'Please enter conform password' }]}>
					<Input type="password" placeholder="conform password" />
				</Form.Item>
				<Form.Item>
					<Button htmlType="submit" type="primary" className="login-page-form_button">
						sign up
					</Button>
				</Form.Item>
				<h4>
					Already a user? <a>LOGIN</a>
				</h4>
			</Form>
		</div>
	)
}

export default SignupForm
