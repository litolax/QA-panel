import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {GetServerSideProps, NextPage} from "next";
import {authRedirect} from "../../src/server/authRedirect";
import IAccount from "../../src/types/IAccount";
import Profile from "../../components/Profile";
const { NEXTAUTH_URL } = process.env;

const ProfilePage: NextPage<{ account: IAccount }> = (props) => {
    return (
       <Profile account={props.account}/>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { userId } = ctx.query;
    const response = await fetch(`${NEXTAUTH_URL}/api/user/${userId}`, {
        headers: {
            cookie: ctx.req.headers.cookie || "",
        },
    });

    if (!response.ok)
        throw new Error(response.statusText);
    
    const json = await response.json()
    
    return {
        redirect: await authRedirect(ctx),
        props: {
            account: json.account,
            ...(await serverSideTranslations(ctx.locale || 'ru', ['common', 'profile'])),
        }
    };
}

export default ProfilePage;