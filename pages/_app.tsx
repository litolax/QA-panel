import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import { ConfigProvider, theme } from 'antd';

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
	return (
		<ConfigProvider
			theme={{
				algorithm: theme.darkAlgorithm
			}}
		>
			<SessionProvider session={session}>
				<Component {...pageProps} />
			</SessionProvider>
		</ConfigProvider>
	);
};

export default appWithTranslation(App);
