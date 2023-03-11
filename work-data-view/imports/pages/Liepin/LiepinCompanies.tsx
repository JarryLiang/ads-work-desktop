import CollapsableTagsHolder from "/imports/components/CollapsableTagsHolder";
import PageHolder from "/imports/pages/PageHolder";
import {MeteorHelper} from "/libs/MeteorHelper";

import {ILiepinComp} from "/server/api/liepin/types";
import {ListOP, PromiseHelper} from "@alibobo99/js-helper";
import {Table} from "antd";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';



const LiepinCompHolder = styled.div`
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
  comp:ILiepinComp
}


function LiepinCompanyView(props:IProps){
  const { comp } = props;
  const {compLogo,compName,compScale,compStage,link} = comp;

  const root ="image0.lietou-static.com/bg_white_66x66";
  const imgSrc=`https://${root}/${compLogo}`;
  function handleClick(){
    window.open(link, "_blank");
  }
  return(<LiepinCompHolder>
    <img src={imgSrc}/>
    <div className={"info"}>
      <div className={"line1"} onClick={handleClick}>
        <span>{compName}</span>
      </div>
      <div className={"line2"}>
        {compScale}-{compStage}
      </div>
    </div>
  </LiepinCompHolder>);
}
function LiepinCompanies() {

  const [companies, setCompanies] = useState([]);
  // @ts-ignore
  const [ignoreMap, setIgnoreMap] = useState({});
  const [compJobs, setCompJobs] = useState({});

  async function loadData() {

    const r1: string = await MeteorHelper.AsyncCallRaw("liepin_companies");
    const r2: string = await MeteorHelper.AsyncCallRaw("liepin_companiesIgnore");
    const r3: string = await MeteorHelper.AsyncCallRaw("liepin_companiesJobCount");

    let cc= JSON.parse(r1);
    cc =cc.filter((c:any)=>{
      return c.validComp;
    })
    setCompanies(cc);

    setIgnoreMap(JSON.parse(r2));
    const mm = ListOP.listToMap(JSON.parse(r3), "key");
    setCompJobs(mm);
    // setCompanies(JSON.parse(r1));
    // setIgnoreMap(JSON.parse(r2));
    //
    // const mm = ListOP.listToMap(JSON.parse(r3), "key");
    // setCompJobs(mm);
  }

  useEffect(()=>{
    PromiseHelper.simpleProcess(loadData());
  },[]);

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
        render: (record: ILiepinComp) => {
          return record.compIndustry;
        }
      },
      {
        title: 'name',
        key: 'companyName',
        width: 300,
        render: (record: ILiepinComp) => {
          return (<LiepinCompanyView comp={record}/>);
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
          return(<div/>);
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
      <pre>{JSON.stringify(companies,null,2)}</pre>
    </PageHolder>
  );
}



export default LiepinCompanies;
