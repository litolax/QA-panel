import { ObjectID } from 'bson';
import ReportType from './ReportType';

export default interface IReport {
	_id: ObjectID;
	types: ReportType[];
	mentions?: string[];
	proofs: string;
	comment?: string;
	sender: ObjectID;
}
