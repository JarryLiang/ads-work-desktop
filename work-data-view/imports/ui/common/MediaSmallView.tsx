import {TAggrowingArea} from "/server/api/appgrowing/types";
import React,{useEffect} from 'react';
import styled from 'styled-components';



interface IProps {
  name:string,
  icon:string;
  showName?:boolean;
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


function MediaSmallView(props:IProps) {
  const {name,icon,showName} = props;


  useEffect(()=>{

  },[]);

  return (
    <Holder>
      <img src={icon} alt={name} />
      {showName &&(<div>{name}</div>)}
    </Holder>
  );
}



export default MediaSmallView;
