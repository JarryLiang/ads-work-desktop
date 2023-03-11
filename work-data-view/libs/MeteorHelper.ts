//import {Mongo} from "meteor/mongo";

import {Meteor} from "meteor/meteor";

export interface IBaseRow {
  _id: string;

  [key: string]: any;
}



async function AsyncCallRaw(methodName: string, params?: any):Promise<string> {
  return new Promise((resolve, reject) => {
    if(params){
      // @ts-ignore
      Meteor.call(methodName, params, (err, res) => {
        if(err){
          reject(err);
        }else {
          resolve(res);
        }
      });
    }else {
      // @ts-ignore
      Meteor.call(methodName, (err, res) => {
        if(err){
          reject(err);
        }else {
          resolve(res);
        }
      });
    }

  });
}

export const MeteorHelper = {
  AsyncCallRaw
}

