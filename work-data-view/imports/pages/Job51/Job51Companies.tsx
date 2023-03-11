import CollapsableTagsHolder from "/imports/components/CollapsableTagsHolder";
import {MeteorHelper} from "/libs/MeteorHelper";
import {TJob51Comp} from "/server/api/job51/types";
import {ListOP, PromiseHelper} from "@alibobo99/js-helper";
import {Table} from "antd";

import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import PageHolder from "../PageHolder";


const Job51CompHolder = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr;
  align-items: center;
  grid-gap: 10px;

  > img {
    width: 80px;
    border: solid 1px #CCC;
    padding: 4px;
    border-radius: 8px;
  }

  > .info {
    > .line1 {
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
    }

    > .line2 {
      font-size: 12px;
    }
  }


`;

interface IProps {
  comp: TJob51Comp
}

function Job51CompView(props: IProps) {
  const {comp} = props;
  const {companyHref, companyLogo, companyName, companySizeString, companyTypeString} = comp;

  function handleClick() {
    window.open(companyHref, "_blank");
  }

  return (
    <Job51CompHolder>
      <img src={companyLogo}/>
      <div className={"info"}>
        <div className={"line1"} onClick={handleClick}>
          <span>{companyName}</span>
        </div>
        <div className={"line2"}>
          {companySizeString}-{companyTypeString}
        </div>
      </div>
    </Job51CompHolder>);
}

function Job51Companies() {


  const [companies, setCompanies] = useState([]);
  // @ts-ignore
  const [ignoreMap, setIgnoreMap] = useState({});
  const [compJobs, setCompJobs] = useState({});
  // @ts-ignore
  const [filter, setFilter] = useState("");


  async function loadData() {

    const r1: string = await MeteorHelper.AsyncCallRaw("job51_companies");
    const r2: string = await MeteorHelper.AsyncCallRaw("job51_companiesIgnore");
    const r3: string = await MeteorHelper.AsyncCallRaw("job51_companiesJobCount");
    setCompanies(JSON.parse(r1));
    setIgnoreMap(JSON.parse(r2));

    const mm = ListOP.listToMap(JSON.parse(r3), "key");
    setCompJobs(mm);
  }

  useEffect(() => {
    PromiseHelper.simpleProcess(loadData());
  }, []);


  function getJobsCount(_id:string) {
    // @ts-ignore
    const item = compJobs[_id];
    if (item) {
      return item.count;
    }
    return 0;
  }



  function renderCompanies(): any {
    const columns = [
      {
        title: 'industry',
        key: 'industry',
        width: 150,
        render: (record: TJob51Comp) => {
          const {industryType1Str, industryType2Str} = record;
          if (industryType1Str === industryType2Str) {
            return <div>
              {record.industryType1Str}
            </div>;
          }
          return <div>
            <div>
              {record.industryType1Str}
            </div>
            <div>
              {record.industryType2Str}
            </div>
          </div>;
        }
      },
      {
        title: 'name',
        key: 'companyName',
        width: 300,
        render: (record: TJob51Comp) => {
          return (<Job51CompView comp={record}/>);
        }
      },
      {
        title: 'Jobs',
        key: 'adding',
        width:500,
        sorter: (a:any, b:any) => {
          const av = getJobsCount(a._id);
          const bv = getJobsCount(b._id);
          return av - bv;
        },
        render: (record:any) => {
          const {_id} = record;
          // @ts-ignore
          const item = compJobs[_id];
          if (!item) {
            return null;
          }

          // @ts-ignore
          return (<div>
            <div>
              {item.count}
            </div>
            <CollapsableTagsHolder items={item.items} />
          </div>);


        }
      },
      {
        title: '',
        key: 'adding',
        render: () => {
          return (<div/>);
        }
      },
    ];
    return (
      <Table
        bordered
        size={"small"}
        pagination={{ position:['topLeft','bottomLeft'] }}
        dataSource={companies}
        columns={columns}
        rowKey={(r: any) => {
          return r._id;
        }}
      />
    );

  }

  return (
    <PageHolder>
      {renderCompanies()}
    </PageHolder>
  );
}



export default Job51Companies;
