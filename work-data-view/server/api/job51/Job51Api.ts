import {ListOp2} from "/libs/ListOp2";
import {IBaseRow} from "/libs/MeteorHelper";
import {ObjectHelper2} from "/libs/ObjectHelper2";
import {GenericItemCol} from "/meteor-mongo/server-api/GenericItemCol";
import {TJob51Comp, TJob51Job} from "/server/api/job51/types";
import {ListOP, StringUtils} from "@alibobo99/js-helper";

import {Mongo} from "meteor/mongo";


const Prefix = "Job51";
const COL_NAMES = {
  job: "Job51_Jobs",
  comp: "Job51_Comps",
  statistic: "Job51_statistic",
  ignore: `${Prefix}_ignore`
}

const COL_Jobs = new Mongo.Collection(COL_NAMES.job);
const COL_Ignore = new Mongo.Collection(COL_NAMES.ignore);
const COL_Comps = new Mongo.Collection(COL_NAMES.comp);

const COL_Statistic = new GenericItemCol(COL_NAMES.statistic);


async function upsertComp(comp: TJob51Comp) {
  await COL_Comps.upsert({_id: comp._id}, {$set: comp}, {multi: false});
}

async function upsertJob(job: TJob51Job) {
  await COL_Jobs.upsert({_id: job._id}, {$set: job}, {multi: false});
}

async function importJobRawList(items: TJob51Job[]) {
  const compKeys: string[] = [
    "coId",
    "companyName",
    "fullCompanyName",
    "companyLogo",
    "companyTypeString",
    "companySizeString",
    "companyHref",
    "industryType1Str",
    "industryType2Str"
  ];

  let comps: TJob51Comp[] = [];

  for await (const item of items) {
    item._id = item.jobId;
    // @ts-ignore
    const comp: TJob51Comp = {};
    ObjectHelper2.copyByKeys(item, comp, compKeys);
    comp._id = comp.coId;
    comps.push(comp);
    await upsertJob(item);
  }

  comps = ListOp2.deDup(comps, (r) => {
    return r._id
  });
  for await (const comp of comps) {
    await upsertComp(comp);
  }
}

async function refreshEnums() {
  const fields = {
    companyTypeString: 1,
    companySizeString: 1,
    industryType1Str: 1,
    industryType2Str: 1,
    jobAreaString: 1,
  }
  const ll = COL_Jobs.find({}, {fields}).fetch() as TJob51Job[];
  const keys = Object.keys(fields);
  const enums: { [key: string]: string[] } = ListOp2.calEnums(ll, keys);
  await COL_Statistic.setItem("enums", JSON.stringify(enums));

}

async function getEnums() {
  const r = await COL_Statistic.getItem("enum") || JSON.stringify({});
  return r;
}

//TODO:
async function setIgnoreComp(_id: string, ignore: boolean) {
  const toSet = {
    _id,
    ignore
  }
  COL_Ignore.upsert({_id}, toSet, {multi: false});
}

async function getIgnoreCompMap() {
  const ll: IBaseRow[] = await COL_Ignore.find({}).fetch() as IBaseRow[];
  const mm = ListOP.listToMap(ll, (r: IBaseRow) => r._id);
  return JSON.stringify(mm);
}

async function refreshCompJobsCount() {
  const fields = {
    coId:1,
    jobName:1,
  }

  let  ll = await COL_Jobs.find({}, {fields: fields}).fetch();
  ll = ll.filter((r)=>{
    // @ts-ignore
    return !StringUtils.isBlank(r.coId);
  });

  const mm =ListOP.aggByKeyAndSort(ll,"coId");
  const toSave=mm.map((item)=>{
    const {key,count,list} = item;
    const titleList = list.map((r:any)=>{
      return r.jobName;
    });
    return {
      key,count,items:titleList
    }
  });
  await COL_Statistic.setItem("CompJobCount", JSON.stringify(toSave));
}

async function getCompJobCount(){
  const r= await COL_Statistic.getItem("CompJobCount") || JSON.stringify([]);
  return r;
}

async function getCompanies() {
  const rr =await COL_Comps.find({}).fetch();
  return JSON.stringify(rr);
}

export const Job51Api = {
  importJobRawList,
  refreshEnums,
  getEnums,
  refreshCompJobsCount,
  getCompJobCount,
  getIgnoreCompMap,
  setIgnoreComp,
  getCompanies
}
