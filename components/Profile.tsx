import {Avatar, Button, Card, Select, Typography} from 'antd';
import {useTranslation} from "next-i18next";
import Image from "next/image";
import IAccount from "../src/types/IAccount";
import Permissions from "../src/types/Permissions";
import MainMenu from "./MainMenu";
import {useState} from "react";
import {signOut, useSession} from "next-auth/react";

const Profile = (props: { account: IAccount, minePermission: Permissions }) => {
    const session = useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    const {t} = useTranslation('profile');
    const myProfile = session.data?.user?.name == props.account.username;
    
    const handlePermissionChange = async (permission: string) => {
        const response = await fetch(`/api/user/permission/${props.account.username}/${+permission}`, {
            method: 'POST',
        });

        if (!response.ok)
            throw new Error(response.statusText)
    };

    return (
        <>
            <MainMenu state={{open: menuOpen, setOpen: setMenuOpen}}/>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '10% auto',
            }}>
                <Card
                    title={myProfile ? t('titleMine') : `${t('titleNotMine')} ${props.account.username}`}
                    bordered={false} style={{
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
                        {props.minePermission == Permissions.Developer && !myProfile ?
                            (<>
                                <Typography.Title level={3} style={{margin: 0}}>
                                    {t('user.permissions')}: {<Select
                                    defaultValue={t(`common:permissions.${Permissions[props.account.permissions]}`)}
                                    style={{width: 145, marginLeft: 10}}
                                    onChange={handlePermissionChange}
                                    options={[
                                        {
                                            value: Permissions.Senior,
                                            label: t(`common:permissions.${Permissions[Permissions.Senior]}`),
                                        },
                                        {
                                            value: Permissions.Middle,
                                            label: t(`common:permissions.${Permissions[Permissions.Middle]}`),
                                        },
                                        {
                                            value: Permissions.Junior,
                                            label: t(`common:permissions.${Permissions[Permissions.Junior]}`),
                                        }
                                    ]}
                                />}
                                </Typography.Title>
                            </>) :
                            (<>
                                <Typography.Title level={3} style={{margin: 0}}>
                                    {t('user.permissions')}: {t(`common:permissions.${Permissions[props.account.permissions]}`)}
                                </Typography.Title>
                            </>)}
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

export default Profile;