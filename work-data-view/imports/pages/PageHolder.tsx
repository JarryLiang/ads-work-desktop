import {MenuBar} from "/imports/ui/Menubar";
import React,{useEffect} from 'react';
import styled from 'styled-components';


const Holder = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  >.root-content {
    flex: 1;
    overflow-y: auto;
    border: solid 1px #00C;    
  }
`;

interface IProps {
  children:any;
}

function PageHolder(props:IProps) {
  const {children} = props;

  useEffect(()=>{

  },[]);


  return (
    <Holder>
      <div>
        <MenuBar/>
      </div>
      <div className={"root-content"}>
        {children}
      </div>
    </Holder>
  );
}


export function PageHolder_ForStory(props:IProps){
 return (<PageHolder {...props} />);
}

export default PageHolder;
