import {StringUtils} from "@alibobo99/js-helper";
import ObjectHelper from "@alibobo99/js-helper/dist/utils/ObjectUtils";


// @ts-ignore

function getValue(o,field:any,defaultValue:any){
  if(typeof(field)==="string"){
    return o[field]||defaultValue;
  }
  return ObjectHelper.getByPath(field,o,defaultValue);
}
function stringSorter(field:any){
  return (a:any,b:any)=>{
    const av = getValue(a,field,"");
    const bv = getValue(b,field,"");
    return av.localeCompare(bv);
  }
}

function numberSorter(field:any){
  return (a:any,b:any)=>{
    const av = getValue(a,field,0);
    const bv = getValue(b,field,0);
    return av-bv;
  }
}

const sorters = {
  stringSorter,
  numberSorter
}
export const AntdTableHelper = {
  sorters
}
