import React from "react";
import { useRouteError } from "react-router-dom";
export default function Error() {
  const error = useRouteError();
  console.log("error is", error);
  return (
    <>
      <h1 className="flex-grow-1">Error: {error.message}</h1>
      <pre>
        {error.status} - {error.statusText}
      </pre>
    </>
  );
}
