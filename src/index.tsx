import React from "react";
import ReactDOM from "react-dom";
import TestComponent from "./TestComponent";

ReactDOM.render(
  <React.StrictMode>
    <TestComponent />
  </React.StrictMode>,
  document.querySelector(".root")
);
