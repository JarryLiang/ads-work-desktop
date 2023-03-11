

interface IGetKey {
  (v:any):any;
}

function deDup(comps: any[], getKey?:IGetKey) {
  const exists = {};

  comps.forEach((item)=>{
    if(getKey){
      const v = getKey(item);
      // @ts-ignore
      exists[v]= item;
    }else {
      const v=JSON.stringify(item);
      // @ts-ignore
      exists[v]= item;
    }
  });
  const ll=Object.keys(exists).map((k)=>{
    // @ts-ignore
    return exists[k];
  });
  return ll;
}
function calEnums(ll: any[], keys: string[]) {

  const result = {};

  keys.forEach((k)=>{
    // @ts-ignore
    result[k]={};
  })

  ll.forEach((item)=>{
    keys.forEach((k)=>{
      const v = item[k];
      if(v){
       // @ts-ignore
        result[k][v]=true;
      }
    });
  });

  Object.keys(result).forEach((k)=>{
    // @ts-ignore
    result[k]=Object.keys(result[k]);
  });
  return result;

}

function mergeTwoList(list1:any[], list2:any[], getKey?:IGetKey) {

  const existed = {};

  const result:any = [];
  if (list1) {
    list1.forEach((r) => {
      const key = getKey ? getKey(r) : JSON.stringify(r);
      // @ts-ignore
      if (!existed[key]) {
        result.push(r);
        // @ts-ignore
        existed[key] = true;
      }
    });
  }

  if (list2) {
    list2.forEach((r) => {
      const key = getKey ? getKey(r) : JSON.stringify(r);
      // @ts-ignore
      if (!existed[key]) {
        result.push(r);
        // @ts-ignore
        existed[key] = true;
      }
    });
  }

  return result;
}

export const ListOp2 = {
  deDup,
  calEnums,
  mergeTwoList
}
