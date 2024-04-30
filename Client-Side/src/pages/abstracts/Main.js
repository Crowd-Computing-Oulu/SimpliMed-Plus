import React from "react";

import GetSummary from "./GetSummary";
import Abstracts from "./Abstracts";
import Loading from "./Loading";
import { AppContext } from "../../App";
export default function Main() {
  const { state, abstract, setState } = React.useContext(AppContext);

  return (
    <>
      <GetSummary setState={setState} tabAbstract={abstract} />
      {state && !state.isLoading && state.abstractData && (
        <Abstracts abstracts={state.abstractData} />
      )}
      {state && state.isLoading ? <Loading /> : null}
    </>
  );
}
