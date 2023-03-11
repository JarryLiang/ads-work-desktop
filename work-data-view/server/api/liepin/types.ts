export interface Recruiter {
  imId:           string;
  imUserType:     string;
  chatted:        boolean;
  recruiterName:  string;
  recruiterTitle: string;
  recruiterId:    string;
  recruiterPhoto: string;
}


export interface Pokedex {
  job:        Job;
  recruiter:  Recruiter;
  comp:       Comp;
  dataParams: string;
  dataInfo:   string;
}

export interface Comp {
  compName:     string;
  compId?:      number;
  compIndustry: string;
  compStage?:   string;
  compLogo:     string;
  link:         string;
  compScale:    string;
}

export interface Job {
  labels:           string[];
  jobId:            string;
  jobKind:          string;
  title:            string;
  requireWorkYears: string;
  requireEduLevel:  string;
  refreshTime:      string;
  topJob:           boolean;
  dq:               string; //地區
  salary:           string;
  link:             string;
  dataPromId:       string;
  advViewFlag:      boolean;
}


