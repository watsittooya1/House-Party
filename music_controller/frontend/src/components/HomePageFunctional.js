import React, { useState, useEffect } from "react";
import RoomJoinPageFunctional from "./RoomJoinPageFunctional";
import CreateRoomPageFunctional from "./CreateRoomPageFunctional";
import Info from "./Info";
import {
    Grid,
    Button,
    ButtonGroup,
    Typography
} from "@mui/material";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import RoomFunctional from "./RoomFunctional";

export default function HomePageFunctional(props) {

    const [roomCode, setRoomCode] = useState(null);

    useEffect(() => {
        fetch('/api/user-in-room')
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
                <Grid item xs={12} align="center">
                    <Typography variant="h3" component="h3">
                        House Party
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to='/join' component={ Link }>
                            Join a Room
                        </Button>
                        <Button color="secondary" to='/info' component={ Link }>
                            Info
                        </Button>
                        <Button color="primary" to='/create' component={ Link }>
                            Create a Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }

    return (
        <Router>
            <Switch>
                {
                // render here basically means this content will be called
                }
                <Route exact path="/" render={() => {
                    return roomCode
                        ? (<Redirect to={`/room/${roomCode}`}/>)
                        : renderHomePage();
                }}/>
                <Route path="/join" component={RoomJoinPageFunctional} />
                <Route path="/info" component={Info} />
                <Route path="/create" component={CreateRoomPageFunctional} />
                <Route
                    path="/room/:roomCode"
                    render={(props) => {
                        return <RoomFunctional {...props} leaveRoomCallback={clearRoomCode}/>
                    }}/>
            </Switch>
        </Router>
    );
}