import PageHolder from "/imports/pages/PageHolder";
import AreaSmallView from "/imports/ui/common/AreaSmallView";
import TableCellAppItem from "/imports/ui/common/TableCellAppItem";
import {AntdTableHelper} from "/imports/ui/common/AntdTableHelper";
import TableCellDeveloperItem from "/imports/ui/common/TableCellDeveloperItem";
import {MeteorHelper} from "/libs/MeteorHelper";
import {TAggrowingArea} from "/server/api/appgrowing/types";
import {PromiseHelper, StringUtils} from "@alibobo99/js-helper";
import {Radio, Table} from "antd";
import React,{useState,useEffect} from 'react';




function AppgrowingReservationPage() {

  const [platforms, setPlatforms] = useState<string[]>([]);
  const [targetPlatform, setTargetPlatform] = useState<string>();
  const [allReserves,setAllReserves ] = useState({});


  async function loadData(){
    const raw=await MeteorHelper.AsyncCallRaw("appgrowing_reservation");
    const mm = JSON.parse(raw);
    setPlatforms(Object.keys(mm));
    setAllReserves(mm);

  }
  useEffect(()=>{
    PromiseHelper.simpleProcess(loadData());

  },[]);

  function renderPlatformSelector(): any {
    const views = platforms.map((p) => {
      return (<Radio.Button key={p} value={p}>{p}</Radio.Button>);
    })
    return (
      <Radio.Group onChange={(e)=>{setTargetPlatform(e.target.value)}}>
        {views}
      </Radio.Group>);
  }

  function renderAreas(areas:TAggrowingArea[]){
    return areas.map((area)=>{
      return (<AreaSmallView key={area.cc} area={area} />)
    });
  }

  const columns = [
    {
      title: 'Cat',
      dataIndex: ['app','category',"name"],
      key: 'category',
      align: "left",
      width: 100,
      sorter: AntdTableHelper.sorters.stringSorter(['app','category',"name"]),
    },
    {
      title: 'Name',
      dataIndex: ['app'],
      key: 'name',
      align: "right",
      width: 250,
      render:(value:any)=>{
        return(<TableCellAppItem {...value}/>);
      }
    },
    {
      title: 'developer',
      dataIndex: ['app','developer'],
      key: 'developer',
      align: "left",
      width: 100,
      sorter: AntdTableHelper.sorters.stringSorter(['app','developer',"name"]),
      render:(value:any)=>{
        if(value){
          return(<TableCellDeveloperItem developer={value} />);
        }
        return (<div>N/A</div>);
      }
    },
    {
      title: 'Adv Count',
      dataIndex:'advertsCount',
      key: 'advertsCount',
      align: "right",
      width: 80,
      sorter:AntdTableHelper.sorters.numberSorter("advertsCount"),
      render:(_:number,record:any)=>{
        return record.adverts;
      }
    },
    {
      title: 'Area',
      dataIndex:'area',
      key: 'area',
      align: "left",
      width: 200,
      render:renderAreas
    },
    {
      title: 'First date',
      dataIndex:'first_dt',
      key: 'first_dt',
      align: "center",
      sorter:AntdTableHelper.sorters.stringSorter("first_dt"),
      width: 100,
    },
    {
      title: '',
      key: 'padding',
      render: (_:any) => {
        return (<div></div>);
      }
    },
  ];

  function renderRevs(){
    if (StringUtils.isBlank(targetPlatform)) {
      return null;
    }

   // @ts-ignore
    const list = allReserves[targetPlatform].list;

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
      {renderRevs()}
    </PageHolder>
  );
}


export default AppgrowingReservationPage;
