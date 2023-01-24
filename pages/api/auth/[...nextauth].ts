import NextAuth from 'next-auth';
import { createAccount, validateAccount } from '../../../src/server/database';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
	providers: [
		GoogleProvider({
			id: 'google',
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!
		})
	],
	secret: process.env.JWT_SECRET,
	pages: {
		signIn: '/',
		signOut: '/',
		error: '/'
	},
	callbacks: {
		async signIn(props) {
			const username = props.user.name;
			const email = props.user.email;

			if (!(await validateAccount(username!))) {
				await createAccount(username!, email!);
			}

			return true;
		}
	}
});
