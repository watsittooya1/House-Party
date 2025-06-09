import React, { useState, useEffect, useMemo } from "react";
import RoomJoinPageFunctional from "./RoomJoinPageFunctional";
import CreateRoomPageFunctional from "./CreateRoomPageFunctional";
import Info from "./Info";
import { Grid, Button, Typography } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate,
} from "react-router-dom";
import RoomFunctional from "./RoomFunctional";
import styled from "@emotion/styled";

const StyledGridItem = styled(Grid)`
  size: {
    xs: 12;
  }
  align-items: center;
`;

const HomePageFunctional: React.FC = () => {
  const [roomCode, setRoomCode] = useState(null);
  // cy TODO: verify we want false default
  const [playbackInit, setPlaybackInit] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        setRoomCode(data.code);
      });
  });

  function clearRoomCode() {
    setRoomCode(null);
  }

  const homePage = useMemo(
    () => (
      <Grid container spacing={3}>
        <StyledGridItem>
          <Typography variant="h3" component="h3">
            House Party
          </Typography>
        </StyledGridItem>
        <StyledGridItem>
          <Grid container spacing={1} justifyContent="center">
            <Grid>
              <Button
                color="primary"
                variant="contained"
                to="/join"
                component={Link}
              >
                Join a Room
              </Button>
            </Grid>
            <Grid>
              <Button
                color="secondary"
                variant="contained"
                to="/info"
                component={Link}
              >
                Info
              </Button>
            </Grid>
            <Grid>
              <Button
                color="primary"
                variant="contained"
                to="/create"
                component={Link}
              >
                Create a Room
              </Button>
            </Grid>
          </Grid>
        </StyledGridItem>
      </Grid>
    ),
    []
  );

  const asdf = true;
  if (asdf) {
    return <>Hello world!</>;
  }
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={roomCode ? <Navigate to={`/room/${roomCode}`} /> : homePage}
        />
        <Route path="/join" element={<RoomJoinPageFunctional />} />
        <Route path="/info" element={<Info />} />
        <Route
          path="/create"
          element={
            // cy TODO: gotta fix this!
            <CreateRoomPageFunctional
              votesToSkip={1}
              guestCanPause={false}
              guestCanQueue={false}
              update={false}
              roomCode={"asdf"}
              updateCallback={() => {}}
            />
          }
        />
        <Route
          path="/room/:roomCode"
          element={
            <RoomFunctional
              leaveRoomCallback={clearRoomCode}
              playbackInitCallback={() => {
                setPlaybackInit(true);
              }}
              playbackInit={playbackInit}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default HomePageFunctional;
