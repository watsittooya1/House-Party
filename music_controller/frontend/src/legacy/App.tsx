import React from "react";
import HomePageFunctional from "./HomePageFunctional";
import SongQueue from "./SongQueue";
import AuthBar from "./AuthBar";

const App: React.FC = () => {
  return (
    <div>
      <>Hello chris!</>
      <div className="appbar">
        <AuthBar />
      </div>
      <div className="center">
        <HomePageFunctional />
      </div>
      <div className="sidebar">
        <SongQueue />
      </div>
    </div>
  );
};

export default App;
