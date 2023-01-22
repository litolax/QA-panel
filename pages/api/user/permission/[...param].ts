import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../src/server/database';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { db } = await connectToDatabase();
	const collection = await db.collection('accounts');
	const { param } = req.query;

	if (req.method === 'GET') {
		if (!param || param.length < 1) return res.json({});
		const data = await collection.findOne({ username: param[0] });
		return res.json({ permission: data.permissions });
	}

	if (!param || param.length < 3 || +param[2] !== 0) return res.json({});

	await collection.updateOne(
		{ username: param[0] },
		{ $set: { permissions: +param[1] } }
	);

	res.json({ result: param });
};
