﻿import {Button, Drawer} from 'antd';
import {useTranslation} from "next-i18next";

const MainMenu = (props: { state: { open: boolean, setOpen: Function } }) => {
    const {t} = useTranslation();
    const onClose = () => {
        props.state.setOpen(false);
    };

    return (
        <>
            <Drawer
                title={t('common:menu.title')}
                placement={'left'}
                closable={false}
                onClose={onClose}
                open={props.state.open}
            >
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '15%',
                    justifyContent: 'space-between'
                }}>
                    <Button type={"primary"}>Создать отчет</Button>
                    <Button type={"primary"}>Посмотреть отчеты</Button>
                    <Button type={"primary"}>Посмотреть список QA</Button>
                </div>
            </Drawer>
        </>
    );
};

export default MainMenu;