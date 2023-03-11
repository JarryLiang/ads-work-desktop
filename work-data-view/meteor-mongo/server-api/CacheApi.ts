import {Mongo} from "meteor/mongo";
import moment from "moment";

export const CacheCollection = new Mongo.Collection('cache');


async function loadItem(_id:string) {
  const row=CacheCollection.findOne({_id});
  if(row){
    // @ts-ignore
    return row["value"];
  }
  return null;

}

async function saveItem(_id: string, value: string) {
  const sel = {
    _id
  }
  const toSet = {
    _id,
    value,
    ts:moment().format("YYYY/MM/DD HH:mm:ss")
  }
  await CacheCollection.upsert(sel, {$set:toSet},{multi:false});
}


async function deleteItem(_id:string){
  await CacheCollection.remove({_id});
}

export const CacheApi = {
  loadItem,
  saveItem,
  deleteItem
}
