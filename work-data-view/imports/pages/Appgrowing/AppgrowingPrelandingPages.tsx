import PrelandingPageCard from "/imports/pages/Appgrowing/PrelandingPageCard";
import PageHolder from "/imports/pages/PageHolder";
import {MeteorHelper} from "/libs/MeteorHelper";
import {PromiseHelper} from "@alibobo99/js-helper";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';


const CardsHolder = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  >div {
    margin: 10px;
  }
`;

interface IProps {

}



function AppgrowingPrelandingPages(props:IProps) {
  const { } = props;

  const [pages,setPages ] = useState([]);

  async function loadData(){
    const raw=await MeteorHelper.AsyncCallRaw("appgrowing_prelandingpages");
    const mm = JSON.parse(raw);
    setPages(mm);
  }
  useEffect(()=>{
    PromiseHelper.simpleProcess(loadData());

  },[]);

  function renderItems(){
    const views = pages.map((r:any)=>{
      return (<PrelandingPageCard key={r._id} item={r}/>);
    });
    return views;
  }
  return (
    <PageHolder>
      <CardsHolder>
        {renderItems()}
      </CardsHolder>
    </PageHolder>
  );
}



export default AppgrowingPrelandingPages;
