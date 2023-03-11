import MediaSmallView from "/imports/ui/common/MediaSmallView";
import TableCellAppItem from "/imports/ui/common/TableCellAppItem";
import React,{useEffect} from 'react';
import styled from 'styled-components';


const Holder = styled.div`
  width: 260px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  border: solid 1px #CCC;
  box-shadow: 3px 3px 3px 0px rgba(0, 0, 0, 0.46);
  -webkit-box-shadow: 3px 3px 3px 0px rgba(0, 0, 0, 0.46);
  -moz-box-shadow: 3px 3px 3px 0px rgba(0, 0, 0, 0.46);
  .thin-scroll {
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
      background-color: #F5F5F5;
      border-radius: 4px;
    }

    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
      background-color: #F5F5F5;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: #F65050;
    }
  }
  >.block1 {
    padding-top: 8px;
    width: 240px;
    font-size: 16px;
  }
  >.block2 {
    width: 240px;
  }
  >.block3 {
    width: 240px;
    display: block;
    text-align: left;
  }
  >.previewBlock {
    width: 240px;
    height: 360px;
    overflow-y: auto;
    >img {
      width: 100%;
    }
    margin-bottom: 8px;
  }
`;

interface IProps {
  item:any;
}

function PrelandingPageCard(props:IProps) {
  const { item } = props;
  const {campaign,link,max_dt,media,resource} = item;
  const {path} = resource;

  useEffect(()=>{

  },[]);

  function renderMedias(){
    const views=media.map((item)=>{
      const {name,icon} = item;
      return(<MediaSmallView key={name} name={name} icon={icon} />);
    });
    return views;
  }
  return (
    <Holder>
      <div className={"block1"}>
      <TableCellAppItem name={campaign[0].name} icon={campaign[0].icon} app_url={link} />
      </div>
      <div className={"block2"}>
        {max_dt}
      </div>
      <div className={"block3"}>
        {renderMedias()}
      </div>
      <div className={"previewBlock thin-scroll"}>
        <img src={path} alt={path}/>
      </div>

    </Holder>
  );
}



export default PrelandingPageCard;
