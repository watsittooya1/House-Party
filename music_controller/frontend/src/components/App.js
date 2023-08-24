import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import HomePageFunctional from "./HomePageFunctional";
import SongQueue from "./SongQueue";

export default class App extends Component { 
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>
                <div className="center">
                    <HomePageFunctional />
                </div>
                <div className="sidebar">
                    <SongQueue />
                </div>
            </div>
        );
    }
}

const appDiv = document.getElementById('app');
const root = createRoot(appDiv);
root.render(<App/>);