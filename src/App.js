import "assets/tailwind.css";
import LoadingSpinner from "components/LoadingSpinner";
import Notify from "components/Notify";
import React, { Fragment } from "react";
import RoutesMain from "RoutesMain";
function App() {
  return (
    <Fragment>
      <RoutesMain></RoutesMain>
      <Notify />
      <LoadingSpinner />
    </Fragment>
  );
}

export default App;
