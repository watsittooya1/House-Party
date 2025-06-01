import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Test from "./Test";
import Test2 from "./Test2";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <h1>hello world!</h1>
        <Routes>
          <Route path="/" element={<Test />} />
          <Route path="/test2" element={<Test2 />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

// import React, { Component } from "react";
// import { createRoot } from "react-dom/client";
// import HomePageFunctional from "./HomePageFunctional";
// import SongQueue from "./SongQueue";
// import AuthBar from "./AuthBar";

// export default class App extends Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return (
//       <div>
//         <div className="appbar">
//           <AuthBar />
//         </div>
//         <div className="center">
//           <HomePageFunctional />
//         </div>
//         <div className="sidebar">
//           <SongQueue />
//         </div>
//       </div>
//     );
//   }
// }

const appDiv = document.getElementById("app");
const root = createRoot(appDiv);
root.render(<App />);
