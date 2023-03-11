
import parseUrl from "parse-url";


/*
*  query
* */
function parse(str:string){
  const result = parseUrl(str);
  return result;
}

export const HtmlUtils2 = {
  parse
}
