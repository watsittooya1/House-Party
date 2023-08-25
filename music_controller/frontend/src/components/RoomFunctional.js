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

export default function RoomFunctional(props) { 
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [guestCanQueue, setGuestCanQueue] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
    const [token, setToken] = useState(undefined);

    // match is prop, added by router, describing how we got to this component
    const roomCode = props.match.params.roomCode;
    const history = useHistory();

    useEffect(() => {
        getRoomDetails();
    }, []);

    function updateShowSettings(value) {
        setShowSettings(value);
    }

    function renderSettingsButton() {
        return (
            <Grid item>
            <Button variant="contained" color="primary" onClick={()=>updateShowSettings(true)}>
                    Settings
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
                        onClick={()=> updateShowSettings(false)}>
                            Close
                    </Button>
                </Grid>
            </Grid>
        );
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
                if (data.is_host) {
                    authenticateSpotify();
                }
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
        fetch('/spotify/is-authenticated')
            .then((response) => response.json())
            .then((data) => {
                setSpotifyAuthenticated(data.status);
                if (!data.status) {
                    fetch('/spotify/get-auth-url')
                        .then((response) => response.json())
                        .then((data) => {
                            window.location.replace(data.url);
                        });
                } else {
                    // set auth token for web playback controller
                    fetch('/spotify/get-auth-token')
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

    if (showSettings) {
        return renderSettings();
    }
    return (
        <div>
            { token
            ? <WebPlayback token={token}/>
            : null }
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Code: {roomCode}
                    </Typography>
                    { isHost
                    ? <Typography color="textSecondary" variant="subtitle1" padding='1px'>You are host</Typography>
                    : null
                    }
                </Grid>
                <MusicPlayerFunctional />
                <Grid item xs={12} align="center">
                    <Grid container spacing={1} justifyContent="center">
                        {isHost ? renderSettingsButton() : null}
                        <Grid item>
                            <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
                                Leave Room
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            
        </div>
    );

}