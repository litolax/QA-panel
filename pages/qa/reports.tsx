import {GetServerSideProps} from "next";
import {authRedirect} from "../../src/server/authRedirect";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import Header from "../../components/Header";
import {API} from "../../src/server/API";
import IReport from "../../src/types/IReport";
import {Button, List, Skeleton, Tag} from "antd";
import {useTranslation} from "next-i18next";
import {useEffect, useState} from "react";
import ReportType from "../../src/types/ReportType";
import IAccount from "../../src/types/IAccount";
import Link from "next/link";
import {Utils} from "../../src/Utils";

export default function Reports(props: { reports: IReport[], accounts: IAccount[] }) {
    useEffect(() => {
        refreshTableData();
    }, [props.reports])

    const {t} = useTranslation('reports');

    const [data, setData] = useState([] as IReport[]);

    const refreshTableData = () => {
        let data: IReport[] = [];

        for (let i = 0; i < props.reports.length; i++) {
            const report = props.reports[i];
            data.push({
                _id: report._id,
                types: report.types,
                mentions: report.mentions,
                proofs: report.proofs,
                comment: report.comment,
                sender: report.sender
            })
        }

        setData(data);
    }

    return (
        <>
            <Header/>

            <div style={{
                width: '80vw',
                margin: '0 auto'
            }}>
                <List
                    className="demo-loadmore-list"
                    itemLayout="vertical"
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item
                            actions={[<Button key={"list-loadmore-edit"}>Accept</Button>,
                                <Button key={"list-loadmore-more"}>Decline</Button>]}
                        >
                            <Skeleton title={false} loading={false} active={true}>
                                <List.Item.Meta
                                    title={<Link
                                        href={`/qa/report/${item._id}`}>{props.accounts.filter(a => a._id == item.sender).length > 0 ? props.accounts.filter(a => a._id == item.sender)[0].username : 'Unknown'}</Link>}
                                    description={item.types.map(type => {
                                        const color = Utils.getReportTypeColor(type);
                                        return (
                                            <>
                                                <Tag color={color} key={type} style={item.types.length > 5 ? {marginBottom: '15px'} : {}}>
                                                    {t(`report:reportType.types.${ReportType[type]}`)}
                                                </Tag>
                                            </>
                                        );
                                    })}
                                />
                                <div>{item.comment ? item.comment : 'Nothing'}</div>
                            </Skeleton>
                        </List.Item>
                    )}
                />
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const reports = await API.getAllReports();
    const accounts = await API.getAllAccounts();

    return {
        redirect: await authRedirect(ctx),
        props: {
            reports: reports,
            accounts: accounts,
            ...(await serverSideTranslations(ctx.locale || 'ru', ['common', 'header', 'qa', 'report'])),
        }
    };
}