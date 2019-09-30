import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import "./css/index.css";

ReactDOM.render(
  <BrowserRouter>
    <App className="Site" />
  </BrowserRouter>,
  document.getElementById("root")
);
registerServiceWorker();
