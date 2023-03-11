import CollapseRenderHolder from "/imports/pages/Appgrowing/CollapseRenderHolder";
import PageHolder from "/imports/pages/PageHolder";
import {MeteorHelper} from "/libs/MeteorHelper";
import {TAppgrowingDevRankAppAdvs} from "/server/api/appgrowing/types";
import {PromiseHelper, StringUtils} from "@alibobo99/js-helper";
import {Radio, Table, Tooltip} from "antd";
import React, {useEffect, useState} from 'react';
import styled from "styled-components";


interface IAppAdvsProps {
  item: TAppgrowingDevRankAppAdvs;
  collapse: boolean;
}

const AppAdvsSimpleHolder = styled.div`
  display: inline-block;

  > img {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    margin: 4px;
    box-shadow: 3px 3px 3px 0px rgba(0, 0, 0, 0.46);
    -webkit-box-shadow: 3px 3px 3px 0px rgba(0, 0, 0, 0.46);
    -moz-box-shadow: 3px 3px 3px 0px rgba(0, 0, 0, 0.46);
  }
`;

const AppAdvsTipHolder = styled.div`
  display: inline-block;
  display: inline-grid;
  grid-template-columns: 56px 1fr;
  align-items: center;

  > img {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    margin: 4px;
  }


`;

const AppAdvsDetailHolder = styled.div`
  display: grid;
  text-align: left;
  grid-template-columns: 56px 1fr;
  > img {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    margin: 4px;
    box-shadow: 3px 3px 3px 0px rgba(0, 0, 0, 0.46);
    -webkit-box-shadow: 3px 3px 3px 0px rgba(0, 0, 0, 0.46);
    -moz-box-shadow: 3px 3px 3px 0px rgba(0, 0, 0, 0.46);
  }
  >.right {
    >.line1 {

    }
    >.line2 {
      font-weight: bold;
    }
  }
`;

function ToolTopPop(props: IAppAdvsProps) {
  const {item } = props;
  const { adverts, app} = item;
  const {id,name, icon} = app;
  return (<AppAdvsTipHolder key={id}>
    <img src={icon}/>
    <div>
      <div>ads:{adverts}</div>
      <div>{name}</div>
    </div>
  </AppAdvsTipHolder>);
}

function TAppgrowingDevRankAppAdvsHolder(props: IAppAdvsProps) {
  const {item, collapse} = props;
  const {adverts, app} = item;
  const { id, name, icon} = app;


  const tip = (<ToolTopPop key={id} item={item} collapse={collapse}/>);

  if (collapse) {
    return (<AppAdvsSimpleHolder key={id}>
      <Tooltip title={tip}>
        <img src={icon}/>
      </Tooltip>
    </AppAdvsSimpleHolder>);
  }
  return (<AppAdvsDetailHolder key={id}>
    <img src={icon}/>
    <div className={"right"}>
      <div className={"line1"}>ads:{adverts}</div>
      <div className={"line2"}>{name}</div>
    </div>
  </AppAdvsDetailHolder>);

}

function DeveloperRankPage() {

  const [platforms, setPlatforms] = useState<string[]>([]);
  const [targetPlatform, setTargetPlatform] = useState<string>();
  const [devRanks, setDevRanks] = useState({});

  async function loadData() {
    const r = await MeteorHelper.AsyncCallRaw("appgrowing_devRank")
    const mm = JSON.parse(r);
    setPlatforms(Object.keys(mm));
    setDevRanks(mm);
    console.log(r);
  }

  useEffect(() => {
    PromiseHelper.simpleProcess(loadData());

  }, []);


  function onChanagePlatform(e: any) {
    setTargetPlatform(e.target.value);
  }

  function renderPlatformSelector(): any {
    const views = platforms.map((p) => {
      return (<Radio.Button key={p} value={p}>{p}</Radio.Button>);
    })
    return (
      <Radio.Group onChange={onChanagePlatform}>
        {views}
      </Radio.Group>);
  }


  function renderApp(item: TAppgrowingDevRankAppAdvs, collapse: boolean) {
    if (collapse) {
      return (<TAppgrowingDevRankAppAdvsHolder item={item} collapse={collapse}/>);
    } else {
      return (<TAppgrowingDevRankAppAdvsHolder item={item} collapse={collapse}/>);
    }
  }

  function renderApplist(applist: TAppgrowingDevRankAppAdvs[]) {
    return (<CollapseRenderHolder items={applist} renderer={renderApp}/>);
  }

  function renderRanks() {
    if (StringUtils.isBlank(targetPlatform)) {
      return null;
    }
    // @ts-ignore
    const list = devRanks[targetPlatform].list;

    const columns = [
      {
        title: 'Name',
        dataIndex: ['developer', 'name'],
        key: 'name',
        align: "right",
        width: 100,
      },
      {
        title: 'Advs',
        key: 'advertsCount',
        width: 50,
        align: "right",
        sorter: (a:any, b:any) => {
          return a.advertsCount - b.advertsCount;
        },
        render: (_:string, record: any) => {
          return (<span>{record.adverts}</span>);
        }
      },
      {
        title: 'Apps Count',
        key: 'app_count',
        dataIndex: 'app_count',
        width: 40,
        align: "right",
        sorter: (a: any, b: any) => {
          return a.app_count - b.app_count;
        },
      },
      {
        title: 'Apps',
        key: 'Apps',
        dataIndex: 'app_list',
        width: 240,
        align: "right",
        render: renderApplist
      },
      {
        title: 'First Date',
        dataIndex: 'first_date',
        key: 'first_date',
        width: 50,
        align: "right",
        sorter: (a: any, b: any) => {
          return StringUtils.compareString(a.first_date, b.first_date);
        },
      },
      {
        title: 'Last Date',
        dataIndex: 'last_date',
        key: 'last_date',
        width: 50,
        align: "right",
        sorter: (a: any, b: any) => {
          return StringUtils.compareString(a.last_date, b.last_date);
        },
      },
      {
        title: '',
        key: 'padding',
        width: 400,
        render: (_:any) => {
          return (<div></div>);
        }
      },
    ];

    return (
      <Table
        bordered
        size={"small"}
        pagination={{position: ['topLeft', 'bottomLeft']}}
        dataSource={list}
        // @ts-ignore
        columns={columns}
        rowKey={(r) => {
          return r._id;
        }}
      />
    );

  }

  return (
    <PageHolder>
      {renderPlatformSelector()}
      {renderRanks()}
    </PageHolder>
  );
}


export default DeveloperRankPage;
