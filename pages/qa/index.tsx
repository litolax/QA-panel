import {GetServerSideProps} from "next";
import {authRedirect} from "../../src/server/authRedirect";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import Header from "../../components/Header";
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import IAccount from "../../src/types/IAccount";
import {ObjectID} from "bson";
const { NEXTAUTH_URL } = process.env;

export default function Index(props: {accounts: IAccount[]}) {
    interface DataType {
        key: ObjectID;
        name: string;
        points: number;
        tags: string[];
    }

    const columns: ColumnsType<DataType> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Points',
            dataIndex: 'points',
            key: 'points',
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a>Points</a>
                    <a></a>
                </Space>
            ),
        },
    ];

    let data: DataType[] = [];

    for (let i = 0; i < props.accounts.length; i++) {
        const account = props.accounts[i];
        data.push({key: account._id, name: account.username, points: account.points, tags: ['nice', 'developer', 'loser']})
    }

    const tableColumns = columns.map((item) => ({ ellipsis: true, ...item, }));
    
    return (
        <>
            <Header/>
            
            <Table dataSource={data} columns={tableColumns} pagination={{ position: ['bottomCenter'] }}/>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const response = await fetch(`${NEXTAUTH_URL}/api/users`);
    
    if (!response.ok)
        throw new Error(response.statusText);
    
    const json = await response.json()
    
    return {
        redirect: await authRedirect(ctx),
        props: {
            accounts: json.accounts,
            ...(await serverSideTranslations(ctx.locale || 'ru', ['common', 'header'])),
        }
    };
}