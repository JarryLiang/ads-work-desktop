import { ObjectUtils } from "@alibobo99/js-helper";

type TClawPlatform =
  | "appgrowing"
  | "leipin"
  | "job51"
  | "data-ai"
  | "bigspy"
  | "Unknown"
  ;

type TClawDataType =
  |"gameReservationList"
  |"developerList"
  |"sloganList"
  |"leafletList"
  |"preLandpageList"
  |"ecomad"
  |"company_summary"
  |"jobCardList"
  |"selectedDqCode" //leipin
  |"dqs_other" //leipin
  |"skip" //leipin
  |"job51job"
  ;


export interface IClawResult  {
  platform:TClawPlatform;
  type: TClawDataType;
  version:number,
  data:any
}

function scanForKey(data: any, targetKey: string, levels:number):any {
  let result:any = null;
  if (levels <= 0) {
    return null;
  }

  Object.keys(data).forEach((k) => {
    if (result) {
      return;
    }
    if (k == targetKey) {
      result = data[k];
    }
  });
  if (result) {
    return result;
  }
  Object.keys(data).forEach((k) => {
    if (result) {
      return;
    }
    const o = data[k];
    if (typeof (o) === 'object') {
      const r = scanForKey(o, targetKey, levels - 1);
      if (r) {
        result = r;
      }
    }
  });
  return result;
}

function hasFieldValue(data: any, fieldName: string, value: string) {
  return data[fieldName] ===value;
}

function prepareBigSpyClawingResult(type:TClawDataType,
                                    data:any):IClawResult {
  const rr:IClawResult = {
    platform:"bigspy",
    type:type,
    version:0,
    data
  }
  return rr;
}
function prepareAppgrowingClawResult(
                           type:TClawDataType,
                           version:number,
                           data:any
                           ):IClawResult {
  const rr:IClawResult = {
    platform:"appgrowing",
    type,
    version:version,
    data
  }
  return rr;
}

function getPlatformFromUrl(data: any):TClawPlatform|undefined {
  const {url} =data;
  if(url){
    if(url.indexOf("bigspy.com")>=0){
      return "bigspy";
    }
    if(url.indexOf("apic.liepin.com")>=0){
      return "leipin";
    }
    if(url.indexOf("www.data.ai")>=0){
      return "data-ai";
    }
    if(url.indexOf("51job.com")>=0){
      return "job51";
    }
  }
  return undefined;
}


function parseDataAI(jo: any) {
  const {queryString} = jo;
  const {value} = queryString;
  if(value==='company_summary'){
    const rr:IClawResult = {
      platform: "data-ai",
      type:"company_summary",
      version:0,
      data:jo.data.data
    }
    return rr;
  }
}

function parseBigSpy(data: any):IClawResult | undefined {
  const platform:TClawPlatform|undefined =getPlatformFromUrl(data);
  if(platform !== "bigspy"){
    return undefined;
  }
  const {url} = data;

  if(url.indexOf("bigspy.com/ecom/get-ecom-ads")>=0){
    return prepareBigSpyClawingResult("ecomad", data.data);
  }
  throw "Unhandled";

}

function prepareLeipinClawResult(type: TClawDataType, data: any) {
  const rr:IClawResult = {
    platform:"leipin",
    type:type,
    version:0,
    data:data
  }
  return rr;
}
function prepareJob51ClawResult(type: TClawDataType, data:any) {
  const rr:IClawResult = {
    platform:"job51",
    type:type,
    version:0,
    data:data
  }
  return rr;
}


const  liepinPath_JobCard:string[] = ["data","data","jobCardList"];
const  path_postdata_params:string[] = ["postData","params"];
const path_data_data:string[] = ["data","data"];
  function seekParamWith(postDataParams: any[], name: string):boolean {
  let match:boolean=false;
  postDataParams.forEach((r)=>{
    if(r.name === name){
      match=true;
    }
  })
  return match;
}
const leipinPaths = {
  pagination1:["data","data","pagination"],
  pagination2:["data","pagination"]
}

function parseLiepin(rootData: any) {
  const jobCardList=ObjectUtils.getByPath(liepinPath_JobCard,rootData,undefined);
  if(jobCardList){
    return prepareLeipinClawResult("jobCardList",jobCardList);
  }

  const postDataParams = ObjectUtils.getByPath(path_postdata_params,rootData,undefined);
  if(postDataParams){
    if(seekParamWith(postDataParams,"selectedDqCode")){
      const d =ObjectUtils.getByPath(path_data_data,rootData,undefined);
      return prepareLeipinClawResult("selectedDqCode",d);
    }
  }
  const {data} = rootData;
  if(data){
    if(data.dqs && data.salaries && data.jobKinds){
      return prepareLeipinClawResult("dqs_other",data);
    }
  }
  let pagination = ObjectUtils.getByPath(leipinPaths.pagination1,rootData, undefined);
  if(pagination){
    // @ts-ignore
    const { totalPage } = pagination;
    if(totalPage == 0){
      return prepareLeipinClawResult("skip", null);
    }
  }
  pagination = ObjectUtils.getByPath(leipinPaths.pagination2,rootData, undefined);
  if(pagination){
    // @ts-ignore
    const { totalPage } = pagination;
    if(totalPage == 0){
      return prepareLeipinClawResult("skip", null);
    }
  }


  return undefined;
}
const path_Job51 = {
    job1:["data","resultbody","job"]
}


function parseJob51(rootData: any) {
    const job1 = ObjectUtils.getByPath(path_Job51.job1,rootData, undefined);
  if(job1){
    const {totalCount,items} = job1;
    if(totalCount ==0){
      return prepareJob51ClawResult("skip", null);
    }else {
      if(items && items.length>0){
        return prepareJob51ClawResult("job51job",  items);
      }else {
        return prepareJob51ClawResult("skip", null);
      }
    }
  }

  return undefined;
}



function parseJsonInternal(rootData:any): any {
  const platform:TClawPlatform|undefined =getPlatformFromUrl(rootData);
  let r:IClawResult | undefined;
  switch (platform) {
    case "bigspy":
      r = parseBigSpy(rootData);
      break;
    case "data-ai":
      r = parseDataAI(rootData);
      break;
    case "leipin":
      r = parseLiepin(rootData);
      break;
    case "job51":
      r = parseJob51(rootData);
      break;
  }

  let oldLiepin = parseLiepin(rootData);
  if(oldLiepin){
    return oldLiepin;
  }


  if(r){
    return r;
  }

  if(hasFieldValue(rootData,"type","sloganList")){
    return prepareAppgrowingClawResult(
      "sloganList",
      0,
      rootData["sloganList"]);
  }
  if(hasFieldValue(rootData,"type","preLandpageList")){
    return prepareAppgrowingClawResult(
      "preLandpageList",
      0,
      rootData["preLandpageList"]);
  }
  if(hasFieldValue(rootData,"type","leafletList")){
    return prepareAppgrowingClawResult(
      "leafletList",
      0,
      rootData["leafletList"]);
  }

  if(hasFieldValue(rootData,"type","gameReservationList")){
    return prepareAppgrowingClawResult(
      "gameReservationList",
      0,
      rootData["gameReservationList"]);
  }

  if(hasFieldValue(rootData,"type","developerList")){
    const developerList = rootData['gameReservationList'];
    if(developerList){
      return prepareAppgrowingClawResult(
        "developerList",
        0,
        developerList);
    }else {
      throw "Error";
    }
  }
  const gameReservationList = scanForKey(rootData, "gameReservationList", 3);
  if (gameReservationList) {
    return prepareAppgrowingClawResult(
      "gameReservationList",
      0,
      gameReservationList);
  }
  const sloganList = scanForKey(rootData, "sloganList", 3);
  if (sloganList) {
    const rr:IClawResult = {
      platform: "appgrowing",
      type: "sloganList",
      version:0,
      data:sloganList
    }
    return rr;
  }
}


function parseJson(json:any):IClawResult|undefined {

  const r1 = parseJsonInternal(json);
  if(r1){
    return r1;
  }

  const {data} = json;
  if(data){
    if (typeof data === "object") {
      return parseJsonInternal(data);
    }
  }else {

  }
  return undefined;
}

function parseFile(text:string):IClawResult|undefined {
  const json = JSON.parse(text);
  const r1 = parseJson(json);
  if(r1){
    return r1;
  }
  return undefined
}

export const ClawerFileAnalysisUtils = {
  parseJson: parseJsonInternal,
  parseFile
}
