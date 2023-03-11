export interface ILiepinRecruiter {
  _id:string;
  imId: string;
  imUserType: string;
  chatted: boolean;
  recruiterName: string;
  recruiterTitle: string;
  recruiterId: string;
  recruiterPhoto: string;
}



export interface ILiepinComp {
  _id:string;
  compName: string;
  compId?: string;
  compIndustry: string;
  compStage?: string;
  compLogo: string;
  link: string;
  compScale: string;
  validComp:boolean;

}


export interface ILiepinJob {
  _id:string;
  labels: string[];
  jobId: string;
  jobKind: string;
  title: string;
  requireWorkYears: string;
  requireEduLevel: string;
  refreshTime: string;
  topJob: boolean;
  dq: string; //地區
  salary: string;
  link: string;
  dataPromId: string;
  advViewFlag: boolean;
  //--- add
  recruiterId:string;
  comp:ILiepinComp
  compId:string;
  validComp:boolean;
}

export interface ILiepinJobRaw {
  job: ILiepinJob;
  recruiter: ILiepinRecruiter;
  comp: ILiepinComp;
  dataParams: string;
  dataInfo: string;
}
