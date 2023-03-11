import {OmButton} from "/libs/UIComponents";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';


const Holder = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  &.exp {
    flex-direction: column;
    flex-wrap: wrap;
  }
  >span {
    cursor: pointer;
  }

`;

interface IProps {
  items:any[];
  initDisplay?:number;
  renderer:(item:any,collapse:boolean)=>any;
}

function CollapseRenderHolder(props:IProps) {
  const { items ,initDisplay ,renderer} = props;
  const defaultSize = initDisplay || 11;

  const [canExpend,setCanExpend ] = useState(false);
  const [collapsed,setCollapsed ] = useState(true);

  useEffect(()=>{
    setCanExpend(items.length>defaultSize);
    setCollapsed(true);
  },[items]);

  function renderItemsIntenal(toRender: string[]) {
    const views=toRender.map((value)=>{
      return renderer(value,collapsed);
    });
    return views;
  }

  function renderItems(){
    if(canExpend){
      if(collapsed){
        const ll = renderItemsIntenal(items.slice(0,defaultSize));
        ll.push(<OmButton type={"primary"} size={"small"} onClick={()=>{setCollapsed(false);}} color={"#000"}>...</OmButton>);
        return ll;
      }else {
        const ll = renderItemsIntenal(items);
        ll.push(<OmButton key={"c2"} type={"primary"} size={"small"} onClick={()=>{setCollapsed(true);}} color={"#000"}>^</OmButton>);
        return ll;
      }
    }
    return renderItemsIntenal(items);
  }
  const clz=collapsed?"":"exp";
  return (
    <Holder className={clz}>
      {renderItems()}
    </Holder>
  );
}


export function CollapseRenderHolder_ForStory(props:IProps){
 return (<CollapseRenderHolder {...props} />);
}

export default CollapseRenderHolder;
