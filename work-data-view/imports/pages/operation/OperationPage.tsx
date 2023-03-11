import PageHolder from "/imports/pages/PageHolder";
import {MeteorHelper} from "/libs/MeteorHelper";
import {OmButton} from "/libs/UIComponents";
import {PromiseHelper} from "@alibobo99/js-helper";
import React, {useEffect} from 'react';


function OperationPage() {


  useEffect(() => {

  }, []);

  function callAppgrowing() {
    PromiseHelper.simpleProcess(MeteorHelper.AsyncCallRaw("appgrowing_import"));
  }

  return (
    <PageHolder>
      OperationPage
      <OmButton type={"primary"} onClick={callAppgrowing}>Appgrowing</OmButton>
    </PageHolder>
  );
}


export default OperationPage;
