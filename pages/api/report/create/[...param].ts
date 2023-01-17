import {NextApiRequest, NextApiResponse} from "next";
import {connectToDatabase} from "../../../../src/server/database";
import IReport from "../../../../src/types/IReport";
export default async (req: NextApiRequest, res: NextApiResponse) => {

    const { param } = req.query;
    console.log(JSON.stringify(param![0]))

    if (!param || param.length < 1) return res.json({});

    const {db} = await connectToDatabase();
    const collection = await db.collection('reports');

    const report = JSON.parse(param[0]) as IReport;

    await collection.insertOne(report)

    res.json({result: param})
}