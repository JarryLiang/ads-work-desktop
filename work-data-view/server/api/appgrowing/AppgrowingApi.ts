import {ListOp2} from "/libs/ListOp2";
import {StringUtils2} from "/libs/StringUtils2";
import {ListOP, StringUtils} from "@alibobo99/js-helper";
import {Mongo} from "meteor/mongo";

import {HtmlUtils2} from "/libs/HtmlUtils2";
import {GenericItemCol} from "/meteor-mongo/server-api/GenericItemCol";
import {TAggrowingDeveloper, TAggrowingReserv, TAppgrowingDevelopRank} from "/server/api/appgrowing/types";


const Prefix = "Appgrowing";

const COL_NAMES = {
  rev: `${Prefix}_Reserve`,
  comp: `${Prefix}_Develops`,
  devRank:`${Prefix}_DeveloperRank`,
  devTrend:`${Prefix}_DevTrend`,
  prelandpage:`${Prefix}_PrelandPage`,
  statistic: `${Prefix}_statistic`
}

const COL_Rev = new Mongo.Collection(COL_NAMES.rev);
const COL_Comps = new Mongo.Collection(COL_NAMES.comp);
const COL_DevRank = new Mongo.Collection(COL_NAMES.devRank);
const COL_DevTrend = new Mongo.Collection(COL_NAMES.devTrend);
const COL_PrelandPage = new Mongo.Collection(COL_NAMES.prelandpage);
// @ts-ignore
const COL_Statistic = new GenericItemCol(COL_NAMES.statistic);


function extractPackageNameFromAppUrl(app_url: string) {
  const data = HtmlUtils2.parse(app_url);
  const {query, pathname} = data;
  let platform: string = "";
  let id: string = "";

  if (app_url.indexOf("play.google.com") >= 0) {
    platform = "Google Play";
    id = query["id"];
  }

  if (app_url.indexOf("apps.apple.com") >= 0) {
    platform = "App Store";
    const ss = pathname.split("/th/app/");
    if (ss.length > 1) {
      id = ss[1];
    }
  }
  return {
    platform, id
  }

}

async function upsertRev(item: TAggrowingReserv) {
  const sel = {
    _id:item._id
  }
  await COL_Rev.upsert(sel,{$set:item},{multi:false});
}

async function upsertDeveloper(developer: TAggrowingDeveloper) {
  const sel = {
    _id:developer._id
  }
  await COL_Comps.upsert(sel,{$set:developer},{multi:false});
}



async function importGameReservationList(rootData: any) {

  const {data} = rootData;
  if (!data || data.length == 0) {
    return
  }

  const items: TAggrowingReserv[] = data;
  for await (const item of items) {
    const {app,adverts} = item;

    const advertsCount=StringUtils2.tryParseNumber(adverts)||0;

    const {developer, app_url} = app;
    const {platform, id} = extractPackageNameFromAppUrl(app_url);
    developer._id = developer.id;
    item._id = app.id;
    item.advertsCount = advertsCount;
    // @ts-ignore
    item.platform = platform;
    item.packageOrBundle = id;
    // @ts-ignore
    app.platform = platform;
    app.packageOrBundle = id;
    await upsertRev(item);
    await upsertDeveloper(developer);

  }


}

interface ITrend {
  dt:string;
  data:{
    value:string
  }[];
}
async function updateDeveloperTrend(_id: string, trend: ITrend[]) {
  const sel = { _id };
  const row = await COL_DevTrend.findOne(sel);

  const toSet = {
    _id,
    trend
  }

  if(row){
    // @ts-ignore
    const oldTrend:ITrend[] =row["trend"];
    const newTrends=ListOp2.mergeTwoList(oldTrend,trend);
    newTrends.sort((a:ITrend,b:ITrend)=>{
      StringUtils.compareString(a.dt,b.dt);
    });
    toSet.trend = newTrends;
  }
  await COL_DevTrend.upsert(sel,{$set:toSet},{multi:false});

}

async function upsertDeveloperRank(newItem: TAppgrowingDevelopRank) {
  const sel = {
    _id:newItem._id
  }
  await COL_DevRank.upsert(sel,{$set:newItem},{multi:false});
}

async function importDeveloperList(rootData: any) {
  const {data} = rootData;
  if (!data || data.length == 0) {
    return
  }
  const items:TAppgrowingDevelopRank[] = data;
  for await (const item of items){
    const {developer,trend,adverts,campaign_type,app_list,...rest} = item;
    const {id} = developer;
    const {name} = campaign_type;
    const _id:string=`${id}_${name}`;

    const advertsCount = StringUtils2.tryParseNumber(adverts);
    // @ts-ignore
    const newItem:TAppgrowingDevelopRank = {
      ...rest,
      app_count:app_list?app_list.length:0,
      advertsCount,
      developer,

      campaign_type,
      _id: _id,
      platform: name
    }
    await upsertDeveloperRank(newItem);
    await updateDeveloperTrend(_id,trend);

  }



}

async function upsertPerLandPage(item: any) {
  const sel = {
    _id:item._id
  }
  await COL_PrelandPage.upsert(sel,{$set:item},{multi:false});
}

async function importPreLandpageList(rootData: any) {
  const {data} = rootData;
  if (!data || data.length == 0) {
    return
  }

  for await (const item of data){
    const {id} = item;
    item._id = id;
    await upsertPerLandPage(item);
  }

}

async function getDevRank() {
  const ll= await COL_DevRank.find({}).fetch();
  let result = ListOP.aggByKeyAndSort(ll,"platform");
  // @ts-ignore
  result=ListOP.listToMap(result,"key");
  return JSON.stringify(result);
}
async function getReservations() {
  const ll= await COL_Rev.find({}).fetch();
  let result = ListOP.aggByKeyAndSort(ll,"platform");
  // @ts-ignore
  result=ListOP.listToMap(result,"key");
  return JSON.stringify(result);
}

async function getPrelandingPages() {
  const data =await COL_PrelandPage.find({}).fetch();
  return JSON.stringify(data);
}

export const AppgrowingApi = {
  importGameReservationList,
  importDeveloperList,
  importPreLandpageList,
  getDevRank,
  getReservations,
  getPrelandingPages,

}

