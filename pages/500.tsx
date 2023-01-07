import {Button, Result} from 'antd';
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";

export default function Page500() {
    const {t} = useTranslation();
    return (
        <Result
            status="500"
            title="500"
            subTitle={t('common:errors.somethingWentWrong')}
            extra={<Button type="primary" href={'/'}>{t('errors.backHome')}</Button>}
        />
    );
}

export const getStaticProps: GetStaticProps = async ({locale}) => {
    return {
        props: {
            ...(await serverSideTranslations(locale || 'ru', ['common'])),
        }
    };
}
