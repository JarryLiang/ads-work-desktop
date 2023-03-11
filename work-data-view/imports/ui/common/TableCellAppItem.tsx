import React,{useEffect} from 'react';
import styled from 'styled-components';


const Holder = styled.div`
  display: grid;
  grid-template-columns: 56px 1fr;
  align-items: center;
  text-align: left;
  cursor: pointer;
  >img {
    width: 48px;
    height: 48px;
  }
`;

interface IProps {
  name:string;
  icon:string;
  app_url:string;
}

function TableCellAppItem(props:IProps) {
  const {name,icon,app_url } = props;

  useEffect(()=>{

  },[]);


  function handleClick(){
    window.open(app_url,"_blank");
  }
  return (
    <Holder onClick={handleClick}>
      <img src={icon} alt={icon}/>
      <span>{name}</span>
    </Holder>
  );
}


export default TableCellAppItem;
