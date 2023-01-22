import { GetServerSideProps } from 'next';
import { authRedirect } from '../../src/server/authRedirect';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Header from '../../components/Header';
import { Button, Input, Mentions, Select, Typography } from 'antd';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import ReportType from '../../src/types/ReportType';
import IAccount from '../../src/types/IAccount';
import IReport from '../../src/types/IReport';
import { ObjectId } from 'bson';
import { API } from '../../src/server/API';

export default function Index(props: { accounts: IAccount[]; me: IAccount }) {
	//todo rework all problems with my account and perms to me API
	const { t } = useTranslation('report');
	const session = useSession();

	const [reportTypes, setReportTypes] = useState([ReportType.none]);
	const [comment, setComment] = useState('');
	const [proofs, setProofs] = useState('');
	const [cooperationInfoState, setCooperationInfoState] = useState(false);
	const [mentions, setMentions] = useState('');

	const availableMentions = props.accounts.map(acc => (
		<Mentions.Option value={acc.username} key={acc._id.toString()}>
			{acc.username}
		</Mentions.Option>
	));

	const handleReportTypeChange = async (typeKeys: ReportType[]) => {
		setReportTypes(typeKeys);

		if (typeKeys.includes(ReportType.cooperation))
			setCooperationInfoState(true);
		else {
			setCooperationInfoState(false);
			setMentions('');
		}
	};

	const handleCommentChange = (e: any) => {
		setComment(e.target.value);
	};

	const handleProofsChange = (e: any) => {
		setProofs(e.target.value);
	};

	const onMentionsChange = (value: string) => {
		setMentions(value);
	};

	const createReport = async () => {
		const validatedMentions = mentions
			.split('@')
			.filter(e => e.trim().length > 0)
			.map(e => e.trim());

		const report: IReport = {
			_id: new ObjectId(),
			types: reportTypes,
			mentions: validatedMentions,
			proofs: encodeURIComponent(proofs),
			comment: encodeURIComponent(comment),
			sender: props.me._id
		};

		const response = await fetch(
			`/api/reports/create/${JSON.stringify(report)}`
		);

		if (!response.ok) throw new Error(response.statusText);
	};

	return (
		<>
			<Header />

			<div
				style={{
					width: '80%',
					margin: '0 auto 25px auto'
				}}
			>
				<Typography.Title>{t('title')}</Typography.Title>

				<div
					style={{
						marginBottom: '25px'
					}}
				>
					<Typography.Title level={5} style={{ marginBottom: '25px' }}>
						{t('yourUsername')}: {session.data?.user?.name}
					</Typography.Title>

					<Typography.Text strong={true}>
						{t('reportType.title')}:
					</Typography.Text>
					<Select
						style={{ width: '35vw', marginLeft: 15 }}
						onChange={handleReportTypeChange}
						mode='multiple'
						options={[
							{
								value: ReportType.problem,
								label: t(`reportType.types.${ReportType[ReportType.problem]}`)
							},
							{
								value: ReportType.acceptOtherReport,
								label: t(
									`reportType.types.${ReportType[ReportType.acceptOtherReport]}`
								)
							},
							{
								value: ReportType.cooperation,
								label: t(
									`reportType.types.${ReportType[ReportType.cooperation]}`
								)
							},
							{
								value: ReportType.online,
								label: t(`reportType.types.${ReportType[ReportType.online]}`)
							},
							{
								value: ReportType.devHelp,
								label: t(`reportType.types.${ReportType[ReportType.devHelp]}`)
							},
							{
								value: ReportType.adminHelp,
								label: t(`reportType.types.${ReportType[ReportType.adminHelp]}`)
							}
						]}
					/>
				</div>

				{cooperationInfoState && (
					<div
						style={{
							marginBottom: '25px'
						}}
					>
						<Typography.Text strong={true}>
							{t('mentionQaMembers')}
						</Typography.Text>
						<Mentions
							style={{ width: '15vw', marginLeft: 15 }}
							onChange={onMentionsChange}
							defaultValue='@'
						>
							{availableMentions}
						</Mentions>
					</div>
				)}

				<div
					style={{
						marginBottom: '25px'
					}}
				>
					<Typography.Title level={5} style={{ marginBottom: '25px' }}>
						{t('proofs')}:
					</Typography.Title>
					<Input.TextArea
						onChange={handleProofsChange}
						rows={6}
						style={{ width: '37vw', resize: 'none' }}
					/>
				</div>

				<div
					style={{
						marginBottom: '25px'
					}}
				>
					<Typography.Title level={5} style={{ marginBottom: '25px' }}>
						{t('comment')}:
					</Typography.Title>
					<Input.TextArea
						onChange={handleCommentChange}
						rows={4}
						style={{ width: '37vw', resize: 'none' }}
					/>
				</div>

				<Button type='primary' onClick={createReport}>
					{t('send')}
				</Button>
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
				'report'
			]))
		}
	};
};
