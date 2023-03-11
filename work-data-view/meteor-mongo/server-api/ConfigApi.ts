import {Mongo} from "meteor/mongo";


const ConfigCollection = new Mongo.Collection('config');


const _globalCache: {
  [key: string]: any
} = {};

async function getItem(_id: string, defaultValue?: any) {
  if(_globalCache[_id]){
    return _globalCache[_id];
  }

  const v = await getItemForce(_id);
  if(v){
    return v;
  }
  _globalCache[_id] = defaultValue;
  return defaultValue;
}

async function getItemForce(_id:string){
  const v:any= await ConfigCollection.findOne({_id});
  if(v){
    _globalCache[_id]=v.value;
  }
  return v.value;
}

async function setItem(_id: string, value: any) {
  const toSet = {
    _id,
    value
  }
  await ConfigCollection.upsert({_id},{$set:toSet},{multi:false});
  _globalCache[_id] = value;
}

const keys = {
  IMPORT_PATH:"import_path"
}
export const ConfigApi = {
  getItem,
  getItemForce,
  setItem,
  keys

}
