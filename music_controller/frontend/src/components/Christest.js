import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import HomePageFunctional from "./HomePageFunctional";
import SongQueue from "./SongQueue";
import AuthBar from "./AuthBar";

export default class Christest extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>hello!</div>;
  }
}

const appDiv = document.getElementById("app");
const root = createRoot(appDiv);
root.render(<Christest />);
