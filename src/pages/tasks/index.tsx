import React, { useEffect, useState } from 'react'
import './index.less'
import { MenuOutlined, ClockCircleOutlined } from '@ant-design/icons'
import Create from './create'
import PocketBase from 'pocketbase'

const Index: React.FC = () => {
	const [open, setOpen] = useState(false)
	const [task, setTask] = useState([])

	const showModal = () => {
		setOpen(true)
	}

	const handleCancel = () => {
		setOpen(false)
	}

	const pb = new PocketBase('https://pocketbase-logtracker.asterdio.xyz')

	useEffect(() => {
		const fetchData = async () => {
			try {
				const resultList: any = await pb.collection('tasks').getList(1, 50, {
					filter: 'created >= "2022-01-01 00:00:00"'
				})

				// eslint-disable-next-line no-console

				const groupedTasks = resultList?.items?.reduce((result: any, task: any) => {
					const date = task.date.split('T')[0]

					const existingGroup = result.find((group: any) => group.date === date)
					if (existingGroup) {
						existingGroup.data.push(task)
					} else {
						result.push({ date, data: [task] })
					}

					return result
				}, [])
				setTask(groupedTasks)
				
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error('Error fetching data:', error)
			}
		}

		fetchData()
	}, [])

	function convertMinutesToHoursAndMinutes(minutes: number) {
		const hours = Math.floor(minutes / 60)
		const remainingMinutes = minutes % 60

		return `${hours}:${remainingMinutes}`
	}

	return (
		<div className="container main_wrapper">
			<div className="tasks">
				<button className="add_button" onClick={showModal}>
					add task
				</button>
				<div className="tasks_wrapper">
					{/* <div className="task_header">
						<h4>Jul1-Jul-7</h4>
						<div className="">
							<span className="time_heading"> Week total:</span>
							<span className="time_sub_heading"> 40:00</span>
						</div>
					</div> */}
					{task?.map((item: any) => {
						return (
							<div className="task_list_wrapper">
								<div className="task_list_header">
									<h3 className="time_heading">{item.date}</h3>
									<div className="">
										<span className="time_heading"> Total:</span>
										<span className="time_sub_heading "> 8:00</span>
									</div>
								</div>
								{item?.data?.map((data: any) => {
									return (
										<div className="task_list_item">
											<div className="task_list_item_title flex items-center gap-6">
												<h3 className="">{data.title}</h3>
												{/* <h3 className="">& Time</h3> */}
											</div>
											<div className="task_list_item_title">
												<ClockCircleOutlined />
												<h3 className="text-2xl font-medium">{convertMinutesToHoursAndMinutes(data?.duration)}</h3>
												<MenuOutlined className="action_menu" />
											</div>
										</div>
									)
								})}
							</div>
						)
					})}
				</div>
			</div>
			<Create open={open} handleCancel={handleCancel} />
		</div>
	)
}

export default Index
