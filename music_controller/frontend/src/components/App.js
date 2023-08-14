import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import HomePageFunctional from "./HomePageFunctional";


export default class App extends Component { 
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="center">
                <HomePageFunctional />
            </div>
        );
    }
}

const appDiv = document.getElementById('app');
const root = createRoot(appDiv);
root.render(<App/>);