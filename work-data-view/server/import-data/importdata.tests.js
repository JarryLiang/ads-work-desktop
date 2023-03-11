import {NodeFileUtils} from "/libs/NodeFileUtils";
import {Meteor} from 'meteor/meteor';
import {ClawerFileAnalysisUtils} from "/server/import-data/ClawerFileAnalysisUtils";
import {ConfigApi} from "/meteor-mongo/server-api/ConfigApi";
import * as chai from "chai";
import {LiepinApi} from "/server/api/liepin/LiepinApi";
import {Job51Api} from "/server/api/job51/Job51Api";
import {AppgrowingApi} from "/server/api/appgrowing/AppgrowingApi";
import {BigspyApi} from "/server/api/bigspy/BigspyApi";



const fs = require('fs');

const importRoot = "Y:\\jsons";

if (Meteor.isServer) {

  describe('Import Data', () => {
    it('Test config api', async (done) => {
      done();
      return;
      const v = "Y:\\jsons";
      await ConfigApi.setItem(ConfigApi.keys.IMPORT_PATH, "Y:\\jsons");
      const nv = await ConfigApi.getItem(ConfigApi.keys.IMPORT_PATH);
      chai.assert.equal(v, nv);
      console.log("init path");
      done();
    })

    describe('Bigspy', async () => {
      it('Import Bigspy', async (done) => {
        const dataRoot = await ConfigApi.getItem(ConfigApi.keys.IMPORT_PATH);
        if (!dataRoot) {
          console.error("Invalid data Root");
          return;
        }
        const ll = NodeFileUtils.loopScanFile(importRoot, "bigspy_");

        for await (const item of ll) {
          try {
            const text = await NodeFileUtils.readTextFileAsync(item.fullPath);
            if (text === "null") {
              NodeFileUtils.deleteFile(item.fullPath);
              return;
            }
            const r = ClawerFileAnalysisUtils.parseFile(text);
            if (r) {
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
          } catch (e) {
            console.error(e)
            console.log(item.fullPath);
          }
        }

        done();
      },600000);
    });
    describe('Appgrowing', async () => {
      it('ReservationList', async (done) => {

        const dataRoot = await ConfigApi.getItem(ConfigApi.keys.IMPORT_PATH);
        if (!dataRoot) {
          console.error("Invalid data Root");
          return;
        }
        const ll = NodeFileUtils.loopScanFile(importRoot, "appgrowing-");
        for await (const item of ll) {
          const text = await NodeFileUtils.readTextFileAsync(item.fullPath);
          if (text === "null") {
            NodeFileUtils.deleteFile(item.fullPath);
            return;
          }
          const r = ClawerFileAnalysisUtils.parseFile(text);
          if (r) {
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
                  console.log(r.type);
                  console.log(item.fullPath);
              }

            }
          }
        }
        done();
      });
    });
    describe('job51', () => {

      it('job51 scan', async (done) => {
        const dataRoot = await ConfigApi.getItem(ConfigApi.keys.IMPORT_PATH);
        if (!dataRoot) {
          return;
        }

        const ll = NodeFileUtils.loopScanFile(importRoot, "job51_");

        for await (const item of ll) {
          const text = await NodeFileUtils.readTextFileAsync(item.fullPath);
          if (text === "null") {
            NodeFileUtils.deleteFile(item.fullPath);
            return;
          }
          const r = ClawerFileAnalysisUtils.parseFile(text);
          if (r) {
            if (r.platform === "job51") {
              if (r.type === 'job51job') {
                console.log(r.data.length);
                await Job51Api.importJobRawList(r.data);
              }
            }
          }
        }
        await Job51Api.refreshEnums();
        const ee = await Job51Api.getEnums();
        console.log(ee);
        done();
      })
    })


    describe('Liepin', () => {

      it('Test config api', async () => {
        const v = "Y:\\jsons";
        await ConfigApi.setItem(ConfigApi.keys.IMPORT_PATH, "Y:\\jsons");
        const nv = await ConfigApi.getItem(ConfigApi.keys.IMPORT_PATH);
        chai.assert.equal(v, nv);


      })
      it('Leipin Test', async () => {
        await LiepinApi.refreshCompJobsCount();
        const r = await LiepinApi.getCompJobCounStatistic();
        console.log(r);
      })
      it('Test config api', async (done) => {
        const dataRoot = await ConfigApi.getItem(ConfigApi.keys.IMPORT_PATH);
        if (!dataRoot) {
          return;
        }
        if (fs.existsSync(dataRoot) == false) {
          //=>
          return;
        }

        const ll = NodeFileUtils.loopScanFile(importRoot, "liepin_");
        for await (const item of ll) {
          item.fullPath
          const text = await NodeFileUtils.readTextFileAsync(item.fullPath);
          if (text === "null") {
            NodeFileUtils.deleteFile(f.fullPath);
            return;
          }
          const r = ClawerFileAnalysisUtils.parseFile(text);
          if (r) {
            if ((r.platform === 'leipin') && (r.type === 'jobCardList')) {
              await LiepinApi.importJobRawList(r.data);
            }
          }
        }
        console.log("done!");
        done();
      })


      it('load Jsons', async (done) => {
        //const root= "/Users/alibobo/Documents/ads-data/jsons";
        const filter = (r) => {
          //return r.indexOf("job51_")>=0;
          return r.indexOf("data_ai_") < 0;
        };
        const ll = NodeFileUtils.loopScanFile(importRoot, filter);
        let index = 0;
        let noResultCount = 0;
        console.log(`Files: ${ll.length}`);
        for await (const f of ll) {
          index++;
          const text = await NodeFileUtils.readTextFileAsync(f.fullPath);
          if (text === "null") {
            NodeFileUtils.deleteFile(f.fullPath);
            console.log("NULL");
          }
          try {
            const r = ClawerFileAnalysisUtils.parseFile(text);

            if (!r) {
              console.log(`${index}: no result ${f.fullPath}  size:${text.length}`);
              noResultCount++;
            }
          } catch (e) {
            console.log(`${index}: error ${f.fullPath}`);
          }

        }
        console.log(`No resoult:${noResultCount}`);
        done();
      });
    });
  });
}
