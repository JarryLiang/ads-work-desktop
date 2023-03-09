
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
  |"company_summary";


interface IClawResult  {
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


function parseJson(data:any): any {
  const platform:TClawPlatform|undefined =getPlatformFromUrl(data);
  let r:IClawResult | undefined;
  switch (platform) {
    case "bigspy":{
      r = parseBigSpy(data);
    }
      break;
    case "data-ai":
      r = parseDataAI(data);
      break;
    case "leipin":
      break;
  }
  if(r){
    return r;
  }

  if(hasFieldValue(data,"type","sloganList")){
    return prepareAppgrowingClawResult(
      "sloganList",
      0,
      data["sloganList"]);
  }
  if(hasFieldValue(data,"type","preLandpageList")){
    return prepareAppgrowingClawResult(
      "preLandpageList",
      0,
      data["preLandpageList"]);
  }
  if(hasFieldValue(data,"type","leafletList")){
    return prepareAppgrowingClawResult(
      "leafletList",
      0,
      data["leafletList"]);
  }

  if(hasFieldValue(data,"type","gameReservationList")){
    return prepareAppgrowingClawResult(

      "gameReservationList",
      0,
      data["gameReservationList"]);
  }

  if(hasFieldValue(data,"type","developerList")){
    const developerList = data['gameReservationList'];
    if(developerList){
      return prepareAppgrowingClawResult(
        "developerList",
        0,
        developerList);
    }else {
      throw "Error";
    }
  }
  const gameReservationList = scanForKey(data, "gameReservationList", 3);
  if (gameReservationList) {
    return prepareAppgrowingClawResult(
      "gameReservationList",
      0,
      gameReservationList);
  }
  const sloganList = scanForKey(data, "sloganList", 3);
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

function parseFile(json:any):IClawResult|undefined {
  const {data} = json;
  const r1 = parseJson(json);
  if(r1){
    return r1;
  }

  if(data){
    if (typeof data === "object") {
      return parseJson(data);
    }
  }else {

  }
  return undefined;
}

export const ClawerFileAnalysisUtils = {
  parseFile
}