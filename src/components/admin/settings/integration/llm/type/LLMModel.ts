import { ObjectId } from "mongodb";

export interface LLMModel{
    _id?:string| ObjectId;
    tenantId?:string;
    name?:string
    secreteKey?:string;
    isActive?:boolean
}