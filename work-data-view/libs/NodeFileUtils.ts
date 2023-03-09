const fs = require('fs');
const path = require('path');


interface IFileFilter {
  (fileName: string): boolean;
}


export interface IFileItem {
  name: string,
  fullPath: string,
}


function loopScanFile(parent: string, filter?: IFileFilter | string): IFileItem[] {

  const fileNames = fs.readdirSync(parent);
  const result: IFileItem[] = [];
  let filterText: string | null = null;
  let filterFunc: IFileFilter | null = null;

  if (typeof (filter) === 'string') {
    filterText = filter;
  }
  if (typeof (filter) === 'function') {
    filterFunc = filter;
  }

  fileNames.forEach((file: string) => {
    const fullPath = path.join(parent, file);
    if (fs.lstatSync(fullPath).isDirectory() == false) {
      let match: boolean = false;
      if (filterText || filterFunc) {
        if (filterText != null) {
          if (file.indexOf(filterText) >= 0) {
            match = true;
          }
        }
        if (filterFunc != null) {
          if (filterFunc(file)) {
            match = true;
          }
        }
      } else {
        match = true
      }
      if (match) {
        const item: IFileItem = {
          name: file,
          fullPath: fullPath,
        }
        result.push(item);
      }
    } else {
      const ll = loopScanFile(fullPath, filter);
      ll.forEach((r) => {
        result.push(r);
      })
    }
  });
  return result;
}


function readTextFileSync(fileName: string): string {
  const data = fs.readFileSync(fileName,
    {
      encoding: 'utf8',
      flag: 'r'
    });
  return data;
}

function readTextFileAsync(fileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, {encoding: "utf8", flag: "r"}, (err:any, data:string) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}


export const NodeFileUtils = {
  loopScanFile,
  readTextFileSync,
  readTextFileAsync
}
