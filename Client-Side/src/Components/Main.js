import React from "react";
import { Outlet } from "react-router-dom";

import GetSummary from "./GetSummary";
import Abstracts from "./Abstracts";
import Loading from "./Loading";

export default function Main({ state, setState, abstract }) {
  return (
    <>
      <GetSummary setState={setState} tabAbstract={abstract} />
      {state && !state.isLoading && state.abstractData && (
        <Abstracts abstracts={state.abstractData} />
      )}
      {state && state.isLoading ? <Loading /> : null}
      {/* <Outlet /> */}
    </>
  );
}
