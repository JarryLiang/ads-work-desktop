import {TAggrowingDeveloper} from "/server/api/appgrowing/types";
import React,{useEffect} from 'react';
import styled from 'styled-components';
import AreaSmallView from "./AreaSmallView";


const Holder = styled.div`
  display: inline-grid;
  grid-template-columns: auto 100px;
  align-items: center;
  >.name {
    word-break: break-all;
  }
`;

interface IProps {
  developer:TAggrowingDeveloper
}

function TableCellDeveloperItem(props:IProps) {
  const {developer } = props;
  const { id,name,type,area} = developer;

  useEffect(()=>{

  },[]);


  return (
    <Holder>
      <AreaSmallView key={area.cc} area={area} showCC={false} />
      <div>{name}</div>
    </Holder>
  );
}


export function TableCellDeveloperItem_ForStory(props:IProps){
 return (<TableCellDeveloperItem {...props} />);
}

export default TableCellDeveloperItem;
