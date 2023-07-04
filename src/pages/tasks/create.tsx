import React, { useEffect, useState } from 'react'
import './index.less'
import { useForm } from 'antd/lib/form/Form'
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd'
import PocketBase from 'pocketbase'
import Cookies from 'js-cookie'
import { decodeToken } from 'react-jwt'

type taskParams = {
	title: string
	date: string
	duration: string
	project: string
}

const Create = ({ open, handleCancel }: { open: boolean; handleCancel: any }) => {
	const [project, setProject] = useState<any>()
	const [form] = useForm()

	const pb = new PocketBase('https://pocketbase-logtracker.asterdio.xyz')
	const cookieValue = Cookies.get('auth')

	let myObject: any

	if (cookieValue) {
		myObject = JSON.parse(cookieValue)
	}

	// Decode the JWT and extract the payload
	const decodedToken: any = decodeToken(myObject?.token)

	const totalMins = (time: string) => {
		const [hr, min] = time.split(':')
		const totalMinutes = parseInt(hr) * 60 + parseInt(min)
		return totalMinutes as number
	}

	const onFinish = async (form: taskParams) => {
		try {
			const { title, date, duration, project } = form

			const data = {
				title: title,
				date: date,
				duration: totalMins(duration),
				userId: decodedToken?.id,
				projectId: project
			}
			const response = await pb.collection('tasks').create(data)

			if (response) {
				handleCancel()
			}
		} catch (error) {}
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Saving the token
				pb.authStore.save(myObject?.token, null)
				const resultList = await pb.collection('projects').getList(1, 50)
				// eslint-disable-next-line no-console
				const outputData = resultList?.items.map((item) => ({
					value: item.id,
					label: item.name
				}))

				setProject(outputData)
			} catch (error) {
			
			}
		}

		fetchData()
	}, [])

	return (
		<>
			<Modal visible={open} title="Task Create" onCancel={handleCancel} footer={null}>
				<Form form={form} name="myForm" onFinish={onFinish} layout="vertical">
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<Form.Item name="title" label="Task" rules={[{ required: true, message: 'Please enter your task' }]}>
								<Input placeholder="your task" />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="project" label="Project" rules={[{ required: true, message: 'Please choose date' }]}>
								<Select showSearch placeholder="Select a project" options={project} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="date" label="Date" rules={[{ required: true, message: 'Please choose date' }]}>
								<DatePicker />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item
								name="duration"
								label="Duration"
								rules={[
									{
										required: true,
										pattern: /^[0-9]{1,2}:[0-9]{2}$/,
										message: 'Please enter a valid duration (hr:mm)'
									}
								]}
							>
								<Input placeholder="Enter duration (hr:mm)" />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item>
								<Button type="primary" htmlType="submit">
									Submit
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</>
	)
}
export default Create
