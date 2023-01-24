import { getSession } from 'next-auth/react';

export async function authRedirect(ctx: any) {
	const session = await getSession(ctx);
	if (!session)
		return {
			destination: '/unauthorized',
			permanent: false
		};
	return undefined;
}
