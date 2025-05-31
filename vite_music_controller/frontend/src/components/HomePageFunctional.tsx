import React, { useState, useEffect } from "react";
import RoomJoinPageFunctional from "./RoomJoinPageFunctional";
import CreateRoomPageFunctional from "./CreateRoomPageFunctional";
import Info from "./Info";
import { Grid, Button, Typography } from "@mui/material";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
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
  const [playbackInit, setPlaybackInit] = useState(false);

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

  function renderHomePage() {
    return (
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
    );
  }

  return (
    <Router>
      <Switch>
        {
          // render here basically means this content will be called
        }
        <Route
          exact
          path="/"
          render={() => {
            return roomCode ? (
              <Redirect to={`/room/${roomCode}`} />
            ) : (
              renderHomePage()
            );
          }}
        />
        <Route path="/join" component={RoomJoinPageFunctional} />
        <Route path="/info" component={Info} />
        <Route path="/create" component={CreateRoomPageFunctional} />
        <Route
          path="/room/:roomCode"
          render={(props) => {
            return (
              <RoomFunctional
                {...props}
                leaveRoomCallback={clearRoomCode}
                playbackInitCallback={() => {
                  setPlaybackInit(true);
                }}
                playbackInit={playbackInit}
              />
            );
          }}
        />
      </Switch>
    </Router>
  );
};

export default HomePageFunctional;
