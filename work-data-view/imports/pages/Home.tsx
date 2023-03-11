import PageHolder from "/imports/pages/PageHolder";
import React,{useEffect} from 'react';




interface IProps {

}

function Home(props:IProps) {
  const { } = props;

  useEffect(()=>{

  },[]);


  return (
    <PageHolder>

      Home
    </PageHolder>
  );
}


export function Home_ForStory(props:IProps){
 return (<Home {...props} />);
}

export default Home;
