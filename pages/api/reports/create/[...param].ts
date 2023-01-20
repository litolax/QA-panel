import {NextApiRequest, NextApiResponse} from "next";
import {connectToDatabase} from "../../../../src/server/database";
import IReport from "../../../../src/types/IReport";
export default async (req: NextApiRequest, res: NextApiResponse) => {

    const { param } = req.query;
    console.log(`param: ${param}`)
    if (!param || param.length < 1) return res.json({});

    const {db} = await connectToDatabase();
    const collection = await db.collection('reports');

    console.log(`parse: ${JSON.parse(param[0])}`);
    const report = JSON.parse(param[0]) as IReport;
    console.log(`stringify: ${JSON.stringify(report)}`);

    await collection.insertOne(report)

    res.json({result: report})
}