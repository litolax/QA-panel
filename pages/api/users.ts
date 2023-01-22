import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../src/server/database';
import IAccount from '../../src/types/IAccount';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { db } = await connectToDatabase();

	const accounts = (await db
		.collection('accounts')
		.find()
		.toArray()) as IAccount[];

	res.json({ accounts: accounts });
};
