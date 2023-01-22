import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../../src/server/database';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { db } = await connectToDatabase();
	const collection = await db.collection('accounts');
	const { param } = req.query;

	if (!param || param.length < 3 || +param[2] !== 0) return res.json({});

	await collection.updateOne(
		{ username: param[0] },
		{ $set: { points: +param[1] } }
	);

	res.json({ result: param });
};
