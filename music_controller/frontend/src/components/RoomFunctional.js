import React, { useState, useEffect } from 'react';
import {
    Grid,
    Button,
    Typography,
    Container
} from "@mui/material";
import { useHistory } from "react-router-dom";
import CreateRoomPageFunctional from "./CreateRoomPageFunctional";
import MusicPlayerFunctional from "./MusicPlayerFunctional";
import WebPlayback from "./WebPlayback";
import QueueMenu from "./QueueMenu";

export default function RoomFunctional(props) { 
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [guestCanQueue, setGuestCanQueue] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showQueueSearch, setShowQueueSearch] = useState(false);
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
    const [token, setToken] = useState(undefined);

    // match is prop, added by router, describing how we got to this component
    const roomCode = props.match.params.roomCode;
    const history = useHistory();

    useEffect(() => {
        getRoomDetails();
    }, []);

    function renderSettingsButton() {
        return (
            <Grid item>
            <Button variant="contained" color="primary" onClick={()=>setShowSettings(true)}>
                    Settings
            </Button>
            </Grid>
        );
    }

    function renderQueueSearchButton() {
        return (
            <Grid item>
                <Button variant="contained" color="primary" onClick={()=>setShowQueueSearch(true)}>
                    Queue Song
                </Button>
            </Grid>
        );
    }

    function renderSettings() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPageFunctional
                        update={true}
                        votesToSkip={votesToSkip}
                        guestCanPause={guestCanPause}
                        guestCanQueue={guestCanQueue}
                        roomCode={roomCode}
                        updateCallback={getRoomDetails}
                        />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={()=> setShowSettings(false)}>
                            Close
                    </Button>
                </Grid>
            </Grid>
        );
    }

    function renderQueueSearch() {
        return (<QueueMenu closeMenuCallback={()=>setShowQueueSearch(false)} isAuthenticated={spotifyAuthenticated}/>);
    }

    function getRoomDetails() {
        // ensure response is OK
        fetch('/api/get-room' + '?code=' + roomCode)
            .then((response) => {
                if (!response.ok) {
                    props.leaveRoomCallback();
                    history.push('/');
                }
                return response.json();
            })
            .then((data) => {
                setVotesToSkip(data.votes_to_skip);
                setGuestCanPause(data.guest_can_pause);
                setGuestCanQueue(data.guest_can_queue);
                setIsHost(data.is_host);
                authenticateSpotify();
                
            });


    }

    function leaveButtonPressed() {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        };
        fetch('/api/leave-room', requestOptions)
            .then((_response) => {
                props.leaveRoomCallback();
                history.push('/');
            });
    }

    function authenticateSpotify() {
        const url = `/spotify/is-authenticated?host=${isHost}` 
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setSpotifyAuthenticated(data.status);
                if (data.status === true) {
                    // set auth token for web playback controller
                    fetch(`/spotify/get-auth-token?host=${isHost}`)
                        .then((response) => {
                            if (response.ok) {
                                return response.json();
                            }
                            props.leaveRoomCallback();
                            history.push('/');
                        })
                        .then((data) => {
                            setToken(data.token);
                        });
                }
            });
    }

    function renderRoom() {
        return (<Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Code: {roomCode}
                    </Typography>
                    { isHost
                    ? <Typography color="textSecondary" variant="subtitle1" padding='1px'>You are host</Typography>
                    : null
                    }
                </Grid>
                <Grid item xs={12} align="center">
                    <MusicPlayerFunctional leaveRoomCallback={props.leaveRoomCallback}/>
                </Grid>
                <Grid item xs={12} align="center">
                    <Grid container spacing={1} justifyContent="center">
                        {isHost ? renderSettingsButton() : null}
                        {(isHost || guestCanQueue) ? renderQueueSearchButton() : null}
                        <Grid item>
                            <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
                                Leave Room
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>);
    }

    return (
        <div className="room">
            { (token && isHost)
            ? <WebPlayback token={token}/>
            : null }
            { showSettings
                ? renderSettings()
                : (
                    showQueueSearch
                        ? renderQueueSearch()
                        : renderRoom()
                    )}
        </div>
    );

}