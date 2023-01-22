import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps, NextPage } from 'next';
import { authRedirect } from '../../src/server/authRedirect';
import IAccount from '../../src/types/IAccount';
import Profile from '../../components/Profile';
import Permissions from '../../src/types/Permissions';
import { getSession } from 'next-auth/react';
import { API } from '../../src/server/API';

const ProfilePage: NextPage<{
	account: IAccount;
	minePermission: Permissions;
}> = props => {
	return (
		<Profile account={props.account} minePermission={props.minePermission} />
	);
};

export const getServerSideProps: GetServerSideProps = async ctx => {
	const session = await getSession(ctx);
	const { userId } = ctx.query;

	const account = await API.getAccount(`${userId}`, ctx);
	const minePermission = await API.getUserPermission(
		session?.user?.name ?? '',
		ctx
	);

	return {
		redirect: await authRedirect(ctx),
		props: {
			account: account,
			minePermission: minePermission,
			...(await serverSideTranslations(ctx.locale || 'ru', [
				'common',
				'profile',
				'header'
			]))
		}
	};
};

export default ProfilePage;
