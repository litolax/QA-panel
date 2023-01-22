import { Button, Result } from 'antd';
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Page403() {
	const { t } = useTranslation();
	return (
		<Result
			status='403'
			title='403'
			subTitle={t('common:errors.unauthorized.forAccess')}
			extra={
				<Button type='primary' href={'/'}>
					{t('common:errors.backHome')}
				</Button>
			}
		/>
	);
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale || 'ru', ['common']))
		}
	};
};
