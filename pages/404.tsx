import { Button, Result } from 'antd';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function Page404() {
	const { t } = useTranslation();
	return (
		<Result
			status='404'
			title='404'
			subTitle={t('common:errors.pageDoesNotExist')}
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
