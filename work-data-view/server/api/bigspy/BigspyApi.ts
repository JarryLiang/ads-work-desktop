import {IBigspyAdv} from "/server/api/bigspy/types";
import {Mongo} from "meteor/mongo";


const Prefix = "Bigspy";

const COL_NAMES = {
  ad: `${Prefix}_ad`,
}


const COL_AD = new Mongo.Collection(COL_NAMES.ad);


async function upsertAd(item: IBigspyAdv) {
  const sel = {
    _id:item._id
  }
  await COL_AD.upsert(sel,{$set:item},{multi:false});
}


let no_ad_key = 0;
async function importEcomad(rootData: any) {
  const {data} = rootData;
  if (!data || data.length == 0) {
    return
  }

  const items:IBigspyAdv[] = data;


  console.log(items.length);
  for await (const item of items){
    const {ad_key} = item;
    if(ad_key){
      item._id = ad_key;
      await upsertAd(item);
    }else {
      no_ad_key++;
      console.log(`no_ad_key ${no_ad_key}`);
    }
  }

}

export const BigspyApi = {

  importEcomad
}
