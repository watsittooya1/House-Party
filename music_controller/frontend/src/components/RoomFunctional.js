import React, { useState, useEffect } from 'react';
import {
    Grid,
    Button,
    Typography
} from "@mui/material";
import { useHistory } from "react-router-dom";
import CreateRoomPageFunctional from "./CreateRoomPageFunctional";
import MusicPlayerFunctional from "./MusicPlayerFunctional";

export default function RoomFunctional(props) { 
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
    const [song, setSong] = useState({});

    // match is prop, added by router, describing how we got to this component
    const roomCode = props.match.params.roomCode;
    const history = useHistory();

    useEffect(() => {
        getRoomDetails();
        getCurrentSong();
    }, []);

    useEffect(() => {
        const interval = setInterval(getCurrentSong, 1000);
        return (() => clearInterval(interval));
    });

    function updateShowSettings(value) {
        setShowSettings(value);
    }

    function renderSettingsButton() {
        return (
            <Grid item xs={12} align="center">
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
                        })
                }
            });
    }

    function getCurrentSong() {
        fetch('/spotify/current-song')
            .then((response) => {
                if (!response.ok || response.status === 204) {
                    return {};
                } else {
                    return response.json();
                }
            })
            .then((data) => {
                setSong(data);
            });
    }

    function isEmpty(obj) {
        for (const prop in obj) {
            if (Object.hasOwn(obj, prop)) {
                return false;
            }
        }
        return true;
    }

    if (showSettings) {
        return renderSettings();
    }
    return (
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
            <MusicPlayerFunctional {...song} nonePlaying={isEmpty(song)}/>
            {isHost ? renderSettingsButton() : null}
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    );

}