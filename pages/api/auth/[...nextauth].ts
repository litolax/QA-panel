import NextAuth from 'next-auth';
import { createAccount, validateAccount } from '../../../src/server/database';

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: any) {
	try {
		const url = process.env.HUB_PRIVATE_URL + '/auth/token';

		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				client_id: process.env.HUB_CLIENT as string,
				client_secret: process.env.HUB_SECRET as string,
				grant_type: 'refresh_token',
				refresh_token: token.refreshToken as string
			}),
			method: 'POST'
		});

		const refreshedTokens = await response.json();

		if (!response.ok) {
			throw refreshedTokens;
		}

		return {
			...token,
			accessToken: refreshedTokens.access_token,
			accessTokenExpires:
				new Date().getTime() / 1000 + refreshedTokens.expires_in,
			refreshToken: refreshedTokens.refresh_token ?? token.refreshToken // Fall back to old refresh token
		};
	} catch (error) {
		return {
			...token,
			error: 'RefreshAccessTokenError'
		};
	}
}

export default NextAuth({
	providers: [
		{
			id: 'rise',
			name: 'RISE',
			type: 'oauth',
			authorization: process.env.HUB_PUBLIC_URL + '/authorize',
			token: process.env.HUB_PRIVATE_URL + '/auth/token',
			userinfo: process.env.HUB_PRIVATE_URL + '/auth/info',
			clientId: process.env.HUB_CLIENT,
			clientSecret: process.env.HUB_SECRET,
			profile(profile, tokens) {
				return {
					id: profile.Id,
					name: profile.Username,
					email: profile.Email
				};
			}
		}
	],
	pages: {
		signIn: '/',
		signOut: '/',
		error: '/'
	},
	callbacks: {
		jwt({ token, user, account }) {
			if (account && user) {
				return {
					accessToken: account.access_token,
					accessTokenExpires: account.expires_at,
					refreshToken: account.refresh_token,
					user
				};
			}

			if (new Date().getTime() / 1000 < (token.accessTokenExpires as number)) {
				return token;
			}

			return refreshAccessToken(token);
		},
		async session({ session, token }: { session: any; token: any }) {
			session.user = token.user;
			session.accessToken = token.accessToken;
			session.error = token.error;

			return session;
		},
		async signIn(props) {
			const profile = props.profile as any;
			const username = props.user.name;
			const email = props.user.email;

			if (
				!profile.SpecialPermissions ||
				!profile.SpecialPermissions.includes('qaPanel')
			)
				return '/unauthorized';

			if (!(await validateAccount(username!))) {
				await createAccount(username!, email!);
			}
			return true;
		}
	}
});
