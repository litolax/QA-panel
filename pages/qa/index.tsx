import { GetServerSideProps } from 'next';
import { authRedirect } from '../../src/server/authRedirect';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Header from '../../components/Header';
import { Button, InputNumber, Modal, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import IAccount from '../../src/types/IAccount';
import { ObjectID } from 'bson';
import { useEffect, useState } from 'react';
import Permissions from '../../src/types/Permissions';
import { useTranslation } from 'next-i18next';
import { API } from '../../src/server/API';

export default function Index(props: { accounts: IAccount[]; me: IAccount }) {
	const { t } = useTranslation('qa');
	const [tableData, setTableData] = useState([
		{ key: new ObjectID(), name: '', points: 0, tags: [''] }
	]);
	const [pointsModelOpen, setPointsModelOpen] = useState(false);
	const [pointsInfo, setPointsInfo] = useState({ name: 'unknown', amount: 0 });
	const [accounts, setAccounts] = useState(props.accounts);

	useEffect(() => {
		refreshTableData();
	}, [accounts]);

	const onPointsHandleOk = async () => {
		setPointsModelOpen(false);
		if (props.me.permissions != Permissions.Developer) return;
		const response = await fetch(
			`/api/user/points/update/${pointsInfo.name}/${pointsInfo.amount}/${props.me.permissions}`
		);

		if (!response.ok) throw new Error(response.statusText);

		setAccounts(
			accounts.map(obj => {
				if (obj.username === pointsInfo.name) {
					return { ...obj, points: pointsInfo.amount };
				}

				return obj;
			})
		);

		setPointsInfo({ name: 'unknown', amount: 0 });
	};

	const onPointsHandleCancel = () => {
		setPointsModelOpen(false);
	};

	const onPointsAmountChange = (value: number | null) => {
		setPointsInfo({ name: pointsInfo.name, amount: value ?? 0 });
	};

	const refreshTableData = () => {
		let data: DataType[] = [];

		for (let i = 0; i < accounts.length; i++) {
			const account = accounts[i];
			data.push({
				key: account._id,
				name: account.username,
				points: account.points,
				tags: [t(`common:permissions.${[Permissions[account.permissions]]}`)]
			});
		}

		setTableData(data);
	};

	interface DataType {
		key: ObjectID;
		name: string;
		points: number;
		tags: string[];
	}

	const columns: ColumnsType<DataType> = [
		{
			title: t('table.columns.username'),
			dataIndex: 'name',
			key: 'name',
			render: (text, dataType) => (
				<Button type={'link'} href={`/profile/${dataType.name}`}>
					{text}
				</Button>
			)
		},
		{
			title: t('table.columns.points'),
			dataIndex: 'points',
			key: 'points'
		},
		{
			title: t('table.columns.tags'),
			key: 'tags',
			dataIndex: 'tags',
			render: (_, { tags }) => (
				<>
					{tags.map(tag => {
						let color = tag.length > 5 ? 'geekblue' : 'green';
						if (tag === 'loser') {
							color = 'volcano';
						}
						return (
							<Tag color={color} key={tag}>
								{tag.toUpperCase()}
							</Tag>
						);
					})}
				</>
			)
		},
		{
			title: t('table.columns.actions'),
			key: 'actions',
			render: (_, record) => (
				<Space size='middle'>
					<Button
						onClick={() => {
							setPointsModelOpen(true);
							setPointsInfo({ name: `${record.name}`, amount: 0 });
						}}
						disabled={props.me.permissions != Permissions.Developer}
					>
						{t('changePointsAmount')}
					</Button>
				</Space>
			)
		}
	];

	const tableColumns = columns.map(item => ({ ellipsis: true, ...item }));

	return (
		<>
			<Header />

			<Modal
				title={t('modal.title')}
				open={pointsModelOpen}
				onOk={onPointsHandleOk}
				onCancel={onPointsHandleCancel}
				centered
			>
				<InputNumber
					onChange={onPointsAmountChange}
					value={pointsInfo.amount}
				/>
			</Modal>

			<div
				style={{
					width: '80vw',
					margin: '0 auto'
				}}
			>
				<Table
					dataSource={tableData}
					columns={tableColumns}
					pagination={{ position: ['bottomCenter'] }}
				/>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ctx => {
	const me = await API.getAccount('@me', ctx);
	const accounts = await API.getAllAccounts();

	return {
		redirect: await authRedirect(ctx),
		props: {
			accounts: accounts,
			me: me,
			...(await serverSideTranslations(ctx.locale || 'ru', [
				'common',
				'header',
				'qa'
			]))
		}
	};
};
