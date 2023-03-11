import {NodeFileUtils} from "/libs/NodeFileUtils";
import {ConfigApi} from "/meteor-mongo/server-api/ConfigApi";
import {AppgrowingApi} from "/server/api/appgrowing/AppgrowingApi";
import {BigspyApi} from "/server/api/bigspy/BigspyApi";
import {Job51Api} from "/server/api/job51/Job51Api";
import {LiepinApi} from "/server/api/liepin/LiepinApi";
import {ClawerFileAnalysisUtils, IClawResult} from "/server/import-data/ClawerFileAnalysisUtils";


async function setImportRoot(root: string) {
  await ConfigApi.setItem(ConfigApi.keys.IMPORT_PATH, root);
}

async function getImportRoot() {
  const nv = await ConfigApi.getItem(ConfigApi.keys.IMPORT_PATH);
  return nv;
}

async function getValidImportRoot() {
  const dataRoot = await ConfigApi.getItem(ConfigApi.keys.IMPORT_PATH,"Y:\\jsons");
  if (!dataRoot) {
    throw "Invalid data Root";
    return;
  }
  return dataRoot;
}




async function getTextAndRemoveInvalidFile(fileName: string): Promise<string|null> {
  const text = await NodeFileUtils.readTextFileAsync(fileName);
  if (text === "null") {
    NodeFileUtils.deleteFile(fileName);
    return null;
  }
  return text;
}


async function parseClawResultFromFile(fileName:string): Promise<IClawResult | undefined> {
  const text = await getTextAndRemoveInvalidFile(fileName);
  if (!text) {
    return undefined;
  }
  return ClawerFileAnalysisUtils.parseFile(text);
}


async function loadFileNamesInternal(filter: string) {
  const dataRoot = await getValidImportRoot();
  const ll = await NodeFileUtils.loopScanFile(dataRoot, filter);
  return ll;
}

async function importBigspy() {
  const ll = await loadFileNamesInternal("bigspy_");
  for await (const item of ll) {
    const r = await parseClawResultFromFile(item.fullPath)
    if(r){
      if (r.platform === "bigspy") {
        switch (r.type) {
          case "ecomad":
            await BigspyApi.importEcomad(r.data);
            break;
          default:
            console.log(r.type);
        }
      }
    }
  }
}

async function importAppgrowing() {
  const ll = await loadFileNamesInternal("appgrowing-");
  for await (const item of ll) {
    const r = await parseClawResultFromFile(item.fullPath)
    if(r){
      if (r.platform === "appgrowing") {
        switch (r.type) {
          case "gameReservationList":
            await AppgrowingApi.importGameReservationList(r.data);
            break;
          case "developerList":
            await AppgrowingApi.importDeveloperList(r.data);
            break;
          case "preLandpageList":
            await AppgrowingApi.importPreLandpageList(r.data);
            break;
          default:
            console.log("Not implement");
            console.log(r.platform+" "+r.type);
            console.log(item.fullPath);
        }
      }
    }
  }
}


async function importJob51() {
  const ll = await loadFileNamesInternal("job51_");
  for await (const item of ll) {
    const r = await parseClawResultFromFile(item.fullPath)
    if(r){
      if (r.platform === "job51") {
        if (r.type === 'job51job') {
          console.log(r.data.length);
          await Job51Api.importJobRawList(r.data);
        }
      }
    }
  }
  await Job51Api.refreshEnums();
}


async function importLiepin() {

  const ll = await loadFileNamesInternal("liepin_");
  for await (const item of ll) {
    const r = await parseClawResultFromFile(item.fullPath)
    if(r){
      if (r.platform === "leipin") {
        if (r.type === 'jobCardList') {
          await LiepinApi.importJobRawList(r.data);
        }
      }
    }
  }
  await LiepinApi.refreshCompJobsCount();
}


function importDataAI() {

}

export const ImportDataApi = {
  importBigspy,
  importAppgrowing,
  importLiepin,
  importJob51,
  importDataAI,
  setImportRoot,
  getImportRoot,
  getValidImportRoot

}
