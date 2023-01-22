import { useTranslation } from 'next-i18next';
import { Button, Typography } from 'antd';
import MainMenu from './MainMenu';
import { useState } from 'react';

export default function Header() {
	const [menuOpen, setMenuOpen] = useState(false);
	const { t } = useTranslation('header');

	return (
		<>
			<MainMenu state={{ open: menuOpen, setOpen: setMenuOpen }} />
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					width: '100%',
					height: '80px',
					background: 'rgb(31, 31, 31)',
					marginBottom: '50px'
				}}
			>
				<Typography.Title
					color={'rgb(217, 217, 217)'}
					level={2}
					style={{ margin: 0, marginLeft: '10vw' }}
				>
					{t('title')}
				</Typography.Title>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-evenly',
						width: '30vw',
						marginRight: '5vw'
					}}
				>
					<Button
						style={{
							width: '20%',
							minWidth: '150px'
						}}
						onClick={() => setMenuOpen(!menuOpen)}
					>
						{t('menu.open')}
					</Button>

					<Button
						style={{
							width: '20%',
							minWidth: '150px'
						}}
						href={'/profile/@me'}
					>
						{t('profile.open')}
					</Button>
				</div>
			</div>
		</>
	);
}
