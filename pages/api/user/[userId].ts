import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../src/server/database';
import IAccount from '../../../src/types/IAccount';
import { getSession } from 'next-auth/react';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { userId } = req.query;
	const session = await getSession({ req });

	const { db } = await connectToDatabase();

	const account = (await db.collection('accounts').findOne({
		username: userId == '@me' ? session?.user?.name : userId
	})) as IAccount;

	res.json({ account: account });
};
