import {TAggrowingArea} from "/server/api/appgrowing/types";
import React,{useEffect} from 'react';
import styled from 'styled-components';



interface IProps {
  area:TAggrowingArea,
  showCC?:boolean;
}

const Holder = styled.div`
  display: inline-flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 2px;
  >img {
    width: 26px;
    border: solid 1px #CCC;
  }
  font-weight: bold;
  font-size: 12px;
`;


function AreaSmallView(props:IProps) {
  const {area,showCC} = props;
  // @ts-ignore
  const {cc,name,icon,location} = area;

  useEffect(()=>{

  },[]);

  return (
    <Holder>
      <img src={icon} alt={cc} />
      {showCC &&(<div>{cc}</div>)}
    </Holder>
  );
}


export function AreaSmallView_ForStory(props:IProps){
 return (<AreaSmallView {...props} />);
}

export default AreaSmallView;
