

function copyByKeys(from:any,to:any,keys:string[]){
  keys.forEach((k)=>{
    to[k]= from[k];
  });
}

export const ObjectHelper2 = {
  copyByKeys
}
