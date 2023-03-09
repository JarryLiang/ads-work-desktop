
import {NodeFileUtils} from "/libs/NodeFileUtils";
import { Meteor } from 'meteor/meteor';
import {ClawerFileAnalysisUtils} from "/server/import-data/ClawerFileAnalysisUtils";

if (Meteor.isServer) {
  describe('Import Data', () => {
    describe('Scan file', () => {
      it('load Jsons', async () => {
        const root= "/Users/alibobo/Documents/ads-data/jsons";
        const ll=NodeFileUtils.loopScanFile(root,".json");
        let index =0;
        for await (const f of ll){
          index++;
          const text=await NodeFileUtils.readTextFileAsync(f.fullPath);
          try{
            const jo = JSON.parse(text);
            const r = ClawerFileAnalysisUtils.parseFile(jo)
            if(!r){
              console.log(`${index}: no result ${f.fullPath}`);
            }
          }catch (e) {
            console.log(`${index}: error ${f.fullPath}`);
          }

        }
      });
    });
  });
}