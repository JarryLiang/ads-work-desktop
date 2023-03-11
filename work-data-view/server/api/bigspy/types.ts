export interface IBigspyAdv {
  _id:                 string;
  ad_key:              string;
  advertiser_name:     string;
  page_name:           string;
  app_developer:       string;
  logo_url:            string;
  app_type:            string;
  os:                  string;
  title:               string;
  body:                string;
  message:             string;
  preview_img_url:     string;
  resource_urls:       IBiggspyResourceURL[];
  call_to_action_type: string;
  first_seen:          string;
  last_seen:           string;
  platform:            number;
  type:                string;
  heat:                number;
  impression:          number;
  days_count:          number;
  like_count:          number;
  comment_count:       number;
  share_count:         number;
  feature_ads_flag:    number;
  track_flag:          number;
  textMd5:             string;
  dynamic_number:      string[] | string;
  industry:            string;
  created_at:          number;
  view_count:          number;
  dislike_count:       number;
  pin:                 number;
  is_page_analysis:    number;
  ecom_advertiser_id:  string;
  has_post_id:         number;
  has_page_id:         number;
  has_store_url:       number;
  has_source_url:      number;
}

export interface IBiggspyResourceURL {
  type:      number;
  image_url: string;
  video_url: string;
}
