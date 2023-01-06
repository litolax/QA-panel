import {ObjectID} from "bson";
import Permissions from "./Permissions";

export default interface IAccount {
    _id: ObjectID,
    username: string,
    email: string,
    permissions: Permissions,
    points: number
}
