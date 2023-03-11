import {IBaseRow} from "/libs/MeteorHelper";
import {ListOP} from "@alibobo99/js-helper";
import {Mongo} from "meteor/mongo";
import {ILiepinComp, ILiepinJob, ILiepinJobRaw, ILiepinRecruiter} from "/server/api/liepin/types";
import md5 from "md5";

import {GenericItemCol} from "/meteor-mongo/server-api/GenericItemCol";

const Prefix = "Liepin";
const COL_NAMES = {
  job: "Liepin_Jobs",
  comp: "Liepin_Comps",
  recru: "Liepin_Recruiters",
  statistic: "Liepin_Status",
  ignore:`${Prefix}_ignore`
}

//TODO: add index

const COL_Jobs = new Mongo.Collection(COL_NAMES.job);
const COL_Comps = new Mongo.Collection(COL_NAMES.comp);
const COL_Recruiter = new Mongo.Collection(COL_NAMES.recru);
const COL_Ignore =new Mongo.Collection(COL_NAMES.ignore);
const COL_STATUS = new GenericItemCol(COL_NAMES.statistic);




async function upsertJob(job: ILiepinJob) {
  const {_id} = job;
  await COL_Jobs.upsert({_id}, {$set: job}, {multi: false});
}

async function upsertComp(comp: ILiepinComp) {
  const {_id} = comp;
  await COL_Comps.upsert({_id}, {$set: comp}, {multi: false});
}

async function upsertRecruiter(recruiter: ILiepinRecruiter) {
  const {_id} = recruiter;
  await COL_Recruiter.upsert({_id}, {$set: recruiter}, {multi: false});
}

async function importJobRawList(items: ILiepinJobRaw[]) {

  let i = 0;
  for await (const item of items) {
    i++;
    const {job, comp, recruiter} = item;
    const {recruiterId} = recruiter;
    const {compId} = comp;
    job.recruiterId = recruiterId;
    job.comp = comp;

    if (!compId) {
      const fakeCompId = md5(JSON.stringify(comp));
      comp.compId = fakeCompId;
      comp.validComp = false;
      job.compId = fakeCompId;
      job.validComp = false;

    } else {
      comp.compId = `${compId}`
      comp.validComp = true;
      job.compId = `${compId}`;
      job.validComp = true;
    }
    job._id = job.jobId;
    comp._id = comp.compId!;
    recruiter._id = recruiter.recruiterId;

    //==>upsert =>
    await upsertJob(job);
    await upsertComp(comp);
    await upsertRecruiter(recruiter);
  }
  return i;
}

async function refreshCompJobsCount() {
  const fields = {
    jobId: 1,
    compId: 1,
    title:1,
  }

  const getKey = (r: any) => { return r.compId };
  const ll = await COL_Jobs.find({validComp: true}, {fields: fields}).fetch();
  const mm =ListOP.aggByKeyAndSort(ll,getKey);
  const toSave=mm.map((item)=>{
    const {key,count,list} = item;
    const titleList = list.map((r:any)=>{
      return r.title;
    });
    return {
      key,count,items:titleList
    }
  });
  await COL_STATUS.setItem("CompJobCount", JSON.stringify(toSave));
}


async function init() {
  COL_Jobs.rawCollection().createIndex({compId: 1});
  COL_Jobs.rawCollection().createIndex({recruiterId: 1});
}

async function getCompJobCounStatistic() {
  const r = await COL_STATUS.getItem("CompJobCount", JSON.stringify([]));
  return r;
}


async function getIgnoreCompMap(){
  const ll:IBaseRow[]= await COL_Ignore.find({}).fetch() as IBaseRow[];
  const mm = ListOP.listToMap(ll,(r:IBaseRow)=>r._id);
  return JSON.stringify(mm);
}

async function setIgnoreComp(_id:string,ignore:boolean){
  const toSet = {
    _id,
    ignore
  }
  COL_Ignore.upsert({_id},toSet,{multi:false});
}
async function getCompanies() {
  const ll=await COL_Comps.find({}).fetch();
  return JSON.stringify(ll);
}
export const LiepinApi = {
  init,
  importJobRawList,
  refreshCompJobsCount,
  getCompJobCounStatistic,
  getIgnoreCompMap,
  setIgnoreComp,
  getCompanies,

}
