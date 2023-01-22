import { Button, Result } from 'antd';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getSession, signIn } from 'next-auth/react';

export default function Unauthorized() {
	const { t } = useTranslation();

	return (
		<Result
			style={{
				margin: '15% auto',
				width: '40%'
			}}
			title={t('errors.unauthorized.title')}
			subTitle={t('errors.unauthorized.description')}
			extra={
				<Button type='primary' onClick={() => signIn('rise')}>
					{t('errors.unauthorized.login')}
				</Button>
			}
		/>
	);
}

async function redirectMainPage(ctx: any) {
	const session = await getSession(ctx);
	if (session)
		return {
			destination: '/profile/@me',
			permanent: false
		};
	return undefined;
}

export const getServerSideProps: GetServerSideProps = async ctx => {
	return {
		redirect: await redirectMainPage(ctx),
		props: {
			...(await serverSideTranslations(ctx.locale || 'ru', ['common', 'posts']))
		}
	};
};
