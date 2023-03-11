


function tryParseNumber(str:string):number|undefined{
  if(str){
    if(typeof(str)==="string"){
      let ss = str;
      while (ss.indexOf(",")>=0){
        ss=ss.replace(",","");
      }
      return parseInt(ss);
    }
  }
  return undefined;
}
export const StringUtils2 = {
  tryParseNumber
}
