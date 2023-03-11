import {Tag} from "antd";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';


const Holder = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  span {
    margin: 2px;
  }
`;

interface IProps {
  items:string[],
  initDisplay?:number;
}

function CollapsableTagsHolder(props:IProps) {
  const { items ,initDisplay} = props;
  const defaultSize = initDisplay || 10;
  const [stamp,setStamp ] = useState<number>();
  const [canExpend,setCanExpend ] = useState(false);
  const [collapsed,setCollapsed ] = useState(true);

  useEffect(()=>{
    setStamp(new Date().getTime());
    setCanExpend(items.length>defaultSize);
    setCollapsed(true);
  },[items]);

  function renderItemsIntenal(toRender: string[]) {
    const views=toRender.map((value,index)=>{
      const k=`${stamp}-${value}-${index}`;
      return (<Tag key={k}>{value}</Tag>)
    });
    return views;
  }

  function renderItems(){
    if(canExpend){
      if(collapsed){
        const ll = renderItemsIntenal(items.slice(0,defaultSize));
        ll.unshift(<Tag onClick={()=>{setCollapsed(false);}} color={"#00F"}>...</Tag>);
        return ll;
      }else {
        const ll = renderItemsIntenal(items);
        ll.unshift(<Tag onClick={()=>{setCollapsed(true);}} color={"#00F"}>^</Tag>);
        return ll;
      }
    }
    return renderItemsIntenal(items);

  }
  return (
    <Holder>
      {renderItems()}
    </Holder>
  );
}


export function CollapsableTagsHolder_ForStory(props:IProps){
 return (<CollapsableTagsHolder {...props} />);
}

export default CollapsableTagsHolder;
