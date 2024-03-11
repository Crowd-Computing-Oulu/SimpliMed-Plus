import React from "react";

import GetSummary from "./GetSummary";
import Abstracts from "./Abstracts";
import Loading from "./Loading";
import { AppContext } from "../App";
export default function Main() {
  const context = React.useContext(AppContext);
  const state = context.state;
  const abstract = context.abstract;
  const setState = context.setState;
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
