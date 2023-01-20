import {NextApiRequest, NextApiResponse} from "next";
import {connectToDatabase} from "../../../src/server/database";
import IReport from "../../../src/types/IReport";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const {db} = await connectToDatabase();

    const reports = await db.collection('reports').find().toArray() as IReport[];

    res.json({reports: reports})
}