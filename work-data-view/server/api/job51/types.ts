

export interface TJob51Comp {
  _id:                 string;
  coId:                string;
  companyName:         string;
  fullCompanyName:     string;
  companyLogo:         string;
  companyTypeString:   string; //TODO
  companySizeString:   string; //TODO
  companyHref:         string;
  industryType1Str:    string; //TODO
  industryType2Str:    string; //TODO
}

export interface TJob51Job {
  _id:                 string;
  property:            string;
  jobId:               string;
  jobType:             string;
  jobName:             string;
  jobTags:             string[];
  jobNumString:        string;
  workAreaCode:        string;
  jobAreaCode:         string;
  jobAreaString:       string; //TODO:
  provideSalaryString: string;
  issueDateString:     Date;
  confirmDateString:   Date;
  workYearString:      string;
  degreeString:        string;
  industryType1Str:    string; //TODO
  industryType2Str:    string; //TODO
  funcType1Code:       string;
  funcType2Code:       string;
  major1Str:           string;
  major2Str:           string;
  companyName:         string;
  fullCompanyName:     string;
  companyLogo:         string;
  companyTypeString:   string; //TODO
  companySizeString:   string; //TODO
  hrUid:               string;
  hrName:              string;
  smallHrLogoUrl:      string;
  hrPosition:          string;
  updateDateTime:      Date;
  lon:                 string;
  lat:                 string;
  isCommunicate:       boolean;
  isFromXyx:           boolean;
  isIntern:            boolean;
  isModelEmployer:     boolean;
  isQuickFeedback:     boolean;
  isPromotion:         boolean;
  isApply:             boolean;
  isExpire:            boolean;
  jobHref:             string;
  companyHref:         string;
  allowChatOnline:     boolean;
  term:                string;
  termStr:             string;
  jobScheme:           string;
  coId:                string;
}

// export enum CompanySizeString {
//   The10005000人 = "1000-5000人",
//   The150500人 = "150-500人",
//   The5001000人 = "500-1000人",
//   The50150人 = "50-150人",
//   少于50人 = "少于50人",
// }


// export enum CompanyTypeString {
//   创业公司 = "创业公司",
//   合资 = "合资",
//   已上市 = "已上市",
//   民营 = "民营",
// }

// export enum IndustryTypeStr {
//   Empty = "",
//   互联网电子商务 = "互联网/电子商务",
//   娱乐休闲体育 = "娱乐/休闲/体育",
//   网络游戏 = "网络游戏",
//   计算机软件 = "计算机软件",
// }

// export enum JobAreaString {
//   广州 = "广州",
//   广州天河区 = "广州·天河区",
//   广州海珠区 = "广州·海珠区",
//   广州荔湾区 = "广州·荔湾区",
//   广州越秀区 = "广州·越秀区",
//   广州黄埔区 = "广州·黄埔区",
// }
//


