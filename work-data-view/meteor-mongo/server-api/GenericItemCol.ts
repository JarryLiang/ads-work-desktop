import {Mongo} from "meteor/mongo";

export class GenericItemCol {
  colName:string;
  _col:any;
  _cache: {
    [key: string]: any
  } = {};

  constructor(colName:string) {
    this.colName = colName;
    this._col = new Mongo.Collection(this.colName);
  }

  getItemForce = async (_id:string) =>{
    const v= await this._col.findOne({_id});
    if(v){
      this._cache[_id]=v.value;
    }
    return v;
  }

  getItem = async (_id: string, defaultValue?: any) => {
    if(this._cache[_id]){
      return this._cache[_id];
    }

    const v = await this.getItemForce(_id);
    if(v){
      return v;
    }
    this._cache[_id] = defaultValue;
    return defaultValue;
  }


  setItem = async(_id: string, value: any) =>{
    const toSet = {
      _id,
      value
    }
    await this._col.upsert({_id},{$set:toSet},{multi:false});
    this._cache[_id] = value;
  }

}
