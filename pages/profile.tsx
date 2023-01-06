import {Avatar, Button, Card, Typography} from 'antd';
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {GetServerSideProps, NextPage} from "next";
import {useTranslation} from "next-i18next";
import {authRedirect} from "../src/server/authRedirect";
import {getSession, signOut} from "next-auth/react";
import MainMenu from "../components/MainMenu";
import {useState} from "react";
import Image from "next/image";
import {connectToDatabase} from "../src/server/database";
import IAccount from "../src/types/IAccount";
import {Utils} from "../src/Utils";
import Permissions from "../src/types/Permissions";

const Profile: NextPage<{ account: IAccount }> = (props) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const {t} = useTranslation('profile');
    return (
        <>
            <MainMenu state={{open: menuOpen, setOpen: setMenuOpen}}/>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '10% auto',
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
                            icon={<Image src={'/rise_logo.png'} width={300} height={300} alt={''}/>}
                        />
                        <Typography.Title level={3} style={{margin: 0}}>
                            {t('user.name')}: {props.account.username}
                        </Typography.Title>
                        <Typography.Title level={3} style={{margin: 0}}>
                            {t('user.email')}: {props.account.email}
                        </Typography.Title>
                        <Typography.Title level={3} style={{margin: 0}}>
                            {t('user.permissions')}: {t(`common:permissions.${Permissions[props.account.permissions]}`)}
                        </Typography.Title>
                        <Typography.Title level={3} style={{margin: 0}}>
                            {t('user.points')}: {props.account.points}
                        </Typography.Title>
                        <div style={{
                            display: 'flex',
                            width: '40%',
                            gap: '30px',
                            justifyContent: 'space-around'
                        }}>
                            <Button onClick={() => setMenuOpen(!menuOpen)}>{t('common:menu.open')}</Button>
                            <Button onClick={() => signOut()}>{t('logout')}</Button>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession(ctx);
    const {db} = await connectToDatabase();
    const account = await db.collection('accounts').findOne({username: session?.user?.name, email: session?.user?.email}) as IAccount;
    
    return {
        redirect: await authRedirect(ctx),
        props: {
            account: Utils.cleanup(account),
            ...(await serverSideTranslations(ctx.locale || 'ru', ['common', 'profile'])),
        }
    };
}

export default Profile;