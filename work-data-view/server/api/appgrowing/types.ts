
export interface TAggrowingReserv {
  _id:      string; //app id + platform
  platform:          "App Store"|"Google Play";
  packageOrBundle:  string;
  app:      TAggrowingApp;
  area:     TAggrowingArea[];
  first_dt: Date;
  adverts:  string;
  advertsCount:number;
}

export interface TAggrowingApp {
  id:               string;
  platform:          "App Store"|"Google Play";
  packageOrBundle:  string;
  name:             string;
  icon:             string;
  type:             number;
  developer:        TAggrowingDeveloper;
  app_url:          string;
  first_release:    string;
  in_app_purchases: number;
  isFollow:         boolean;
  category:         TAggrowingCategory;
  price:            any[];
}

export interface TAggrowingCategory {
  id:   number;
  name: string;
}

export interface TAggrowingArea {
  cc:       string;
  name:     string;
  icon:     string;
  location: string;
}

export interface TAggrowingDeveloper {
  _id:  string;
  id:   string;
  name: string;
  type: number;
  icon?: string;
  area: TAggrowingArea;
}


//-------
export interface TAppgrowingDevelopRank {
  _id:           string; // developer id +..
  highlight:     null;
  platform:      string;
  campaign_type: TAppgrowingAdvCampaignType;
  adverts:       string;
  advertsCount?:  number;
  duration:      string;
  first_date:    string;
  last_date:     string;
  media_list:    TAppgrowingMediaList[];
  developer:     TAggrowingDeveloper;
  app_list:      TAppgrowingDevRankAppAdvs[];
  app_count:     number;
  trend:         any
}

export interface TAppgrowingDevRankAppAdvs {
  adverts: number;
  app: TAppgrowingDevRankApp;
}

export interface TAppgrowingDevRankApp {
  type: number;
  id:string;
  name:string;
  icon:string;
}

export interface TAppgrowingAdvCampaignType {
  id:   number;
  name: "App Store"|"Google Play";
}



export interface TAppgrowingMediaList {
  adverts: number;
  media:   TAppgrowingMedia;
}

export interface TAppgrowingMedia {
  id:          number;
  name:        string;
  icon:        string;
  description: string;
}

