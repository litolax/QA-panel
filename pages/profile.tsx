import {Avatar, Button, Card, Typography} from 'antd';
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {GetServerSideProps} from "next";
import {useTranslation} from "next-i18next";
import {authRedirect} from "../src/server/authRedirect";
import {AntDesignOutlined} from "@ant-design/icons";
import {signOut, useSession} from "next-auth/react";

export default function Profile() {
    const session = useSession();
    const {t} = useTranslation('profile');

    return (
        <>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '15% auto',
            }}>
                <Card title={t('title')} bordered={false} style={{
                    width: '35%',
                    minWidth: '300px'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        gap: '2.5vh',
                        justifyContent: 'space-between',
                        fontSize: '20px'
                    }}>
                        <Avatar
                            size={{xs: 34, sm: 42, md: 50, lg: 74, xl: 100, xxl: 120}}
                            draggable={false}
                            icon={<AntDesignOutlined/>}
                        />
                        <Typography.Title level={3} style={{margin: 0}}>
                            {t('user.name')}: {session.data?.user?.name}
                        </Typography.Title>
                        <Typography.Title level={3} style={{margin: 0}}>
                            {t('user.email')}: {session.data?.user?.email}
                        </Typography.Title>
                        <Typography.Title level={3} style={{margin: 0}}>
                            {t('user.points')}: {500}
                        </Typography.Title>
                        <Button onClick={() => signOut()}>{t('logout')}</Button>
                    </div>
                </Card>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    return {
        redirect: await authRedirect(ctx),
        props: {
            ...(await serverSideTranslations(ctx.locale || 'ru', ['profile'])),
        }
    };
}