import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {GetServerSideProps, NextPage} from "next";
import {authRedirect} from "../../src/server/authRedirect";
import IAccount from "../../src/types/IAccount";
import Profile from "../../components/Profile";
import Permissions from "../../src/types/Permissions";
import {getSession} from "next-auth/react";
const { NEXTAUTH_URL } = process.env;

const ProfilePage: NextPage<{ account: IAccount, minePermission: Permissions }> = (props) => {
    return (
        <Profile account={props.account} minePermission={props.minePermission}/>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession(ctx);
    const { userId } = ctx.query;
    
    const userResponse = await fetch(`${NEXTAUTH_URL}/api/user/${userId}`, {
        headers: {
            cookie: ctx.req.headers.cookie || "",
        },
    });

    const permissionResponse = await fetch(`${NEXTAUTH_URL}/api/user/permission/${session?.user?.name}`, {
        method: 'GET',
        headers: {
            cookie: ctx.req.headers.cookie || "",
        },
    });

    if (!userResponse.ok)
        throw new Error(userResponse.statusText);

    if (!permissionResponse.ok)
        throw new Error(permissionResponse.statusText);
    
    const userJson = await userResponse.json()
    const permissionJson = await permissionResponse.json()

    return {
        redirect: await authRedirect(ctx),
        props: {
            account: userJson.account,
            minePermission: permissionJson.permission,
            ...(await serverSideTranslations(ctx.locale || 'ru', ['common', 'profile'])),
        }
    };
}

export default ProfilePage;