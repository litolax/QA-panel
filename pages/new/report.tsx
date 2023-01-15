import {GetServerSideProps} from "next";
import {authRedirect} from "../../src/server/authRedirect";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import Header from "../../components/Header";
import {Button, Input, Mentions, Select, Typography} from "antd";
import {useTranslation} from "next-i18next";
import {useSession} from "next-auth/react";
import {useState} from "react";
import ReportType from "../../src/types/ReportType";
import IAccount from "../../src/types/IAccount";
import IReport from "../../src/types/IReport";
import {ObjectId} from "bson";

const {NEXTAUTH_URL} = process.env;

export default function Index(props: { accounts: IAccount[], me: IAccount }) { //todo rework all problems with my account and perms to me API
    const {t} = useTranslation(); //todo locale
    const session = useSession();

    const [reportTypes, setReportTypes] = useState([ReportType.none]);
    const [comment, setComment] = useState('');
    const [proofs, setProofs] = useState('');
    const [cooperationInfoState, setCooperationInfoState] = useState(false);
    const [mentions, setMentions] = useState('');

    
    const availableMentions = props.accounts.map((acc) => 
        <Mentions.Option value={acc.username} key={acc._id.toString()}>{acc.username}</Mentions.Option>)

    const handleReportTypeChange = async (typeKeys: ReportType[]) => {
        setReportTypes(typeKeys)

        if (typeKeys.includes(ReportType.cooperation))
            setCooperationInfoState(true)
        else {
            setCooperationInfoState(false);
            setMentions('');
        }
    };

    const handleCommentChange = (e: any) => {
        setComment(e.target.value);
    }

    const handleProofsChange = (e: any) => {
        setProofs(e.target.value);
    }

    const onMentionsChange = (value: string) => {
        setMentions(value)
    };
    
    const createReport = () => {
        const report: IReport = {
            _id: new ObjectId(),
            types: reportTypes,
            mentions: mentions,
            proofs: proofs,
            comment: comment,
            sender: props.me._id
        }
        
        //todo add report to db
    }

    return (
        <>
            <Header/>

            <div style={{
                width: '80%',
                margin: '0 auto 25px auto',

            }}>
                <Typography.Title>Создание отчета</Typography.Title>

                <div style={{
                    marginBottom: '25px'
                }}>
                    <Typography.Title level={5} style={{marginBottom: '25px'}}>Ваш
                        никнейм: {session.data?.user?.name}</Typography.Title>

                    <Typography.Text strong={true}>Тип:</Typography.Text>
                    <Select
                        style={{width: '35vw', marginLeft: 15}}
                        onChange={handleReportTypeChange}
                        mode="multiple"
                        options={[
                            {
                                value: ReportType.problem,
                                label: t(`Нахождение проблемы/бага и создание отчета/карточки по нему`),
                            },
                            {
                                value: ReportType.acceptOtherReport,
                                label: t(`Подтверждение карточки (с доказательствами)`),
                            },
                            {
                                value: ReportType.cooperation,
                                label: t(`Кооперация с другим QA`),
                            },
                            {
                                value: ReportType.online,
                                label: t(`Онлайн на тестовом сервере`),
                            },
                            {
                                value: ReportType.devHelp,
                                label: t(`Прямая помощь по просьбе разработчиков`),
                            },
                            {
                                value: ReportType.adminHelp,
                                label: t(`Прямая помощь по просьбе администраторов`),
                            }
                        ]}
                    />
                </div>

                {cooperationInfoState && (
                    <div style={{
                        marginBottom: '25px'
                    }}>
                        <Typography.Text strong={true}>Упомяните участников QA команды, с которыми
                            кооперировались</Typography.Text>
                        <Mentions
                            style={{width: '15vw', marginLeft: 15}}
                            onChange={onMentionsChange}
                            defaultValue="@"
                        >
                            {availableMentions}
                        </Mentions>
                    </div>
                )}

                <div style={{
                    marginBottom: '25px'
                }}>
                    <Typography.Title level={5} style={{marginBottom: '25px'}}>Доказательства:</Typography.Title>
                    <Input.TextArea onChange={handleProofsChange} rows={6} style={{width: '37vw', resize: 'none'}}/>
                </div>

                <div style={{
                    marginBottom: '25px'
                }}>
                    <Typography.Title level={5} style={{marginBottom: '25px'}}>Комментарий:</Typography.Title>
                    <Input.TextArea onChange={handleCommentChange} rows={4} style={{width: '37vw', resize: 'none'}}/>
                </div>

                <Button type="primary" onClick={createReport}>Отправить</Button>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

    const response = await fetch(`${NEXTAUTH_URL}/api/users`);
    const userResponse = await fetch(`${NEXTAUTH_URL}/api/user/@me`, {
        headers: {
            cookie: ctx.req.headers.cookie || "",
        },
    });

    if (!response.ok)
        throw new Error(response.statusText);

    if (!userResponse.ok)
        throw new Error(userResponse.statusText);

    const json = await response.json();
    const userJson = await userResponse.json()

    return {
        redirect: await authRedirect(ctx),
        props: {
            accounts: json.accounts,
            me: userJson.account,
            ...(await serverSideTranslations(ctx.locale || 'ru', ['common', 'header'])),
        }
    };
}