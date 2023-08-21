import React, { Component } from 'react';
import {
    Grid,
    Button,
    Typography
} from "@mui/material";
import CreateRoomPageFunctional from "./CreateRoomPageFunctional";
import MusicPlayerFunctional from "./MusicPlayerFunctional";

export default class Room extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSettings: false,
            spotifyAuthenticated: false,
            song: {},
        };

        // match is prop, added by router, describing how we got to this component
        this.roomCode = this.props.match.params.roomCode;
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
        this.updateShowSettings = this.updateShowSettings.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.authenticateSpotify = this.authenticateSpotify.bind(this);
        this.getCurrentSong = this.getCurrentSong.bind(this);
        this.getRoomDetails();
        this.getCurrentSong();
    }

    componentDidMount() {
        this.interval = setInterval(this.getCurrentSong, 1000);
    }

    // about to be destroyed; do this for cleanup
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    updateShowSettings(value) {
        this.setState({ 
            showSettings: value,
        });
    }

    renderSettingsButton() {
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={()=>this.updateShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        );
    }

    renderSettings() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPageFunctional
                        update={true}
                        votesToSkip={this.state.votesToSkip}
                        guestCanPause={this.state.guestCanPause}
                        roomCode={this.roomCode}
                        updateCallback={this.getRoomDetails}
                        />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={()=> this.updateShowSettings(false)}>
                            Close
                    </Button>
                </Grid>
            </Grid>
        );
    }

    getRoomDetails() {
        // ensure response is OK
        fetch('/api/get-room' + '?code=' + this.roomCode)
            .then((response) => {
                if (!response.ok) {
                    this.props.leaveRoomCallback();
                    this.props.history.push('/');
                }
                return response.json();
            })
            .then((data) => {
                this.setState({
                    votesToSkip: data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost: data.is_host,
                    });
                if (this.state.isHost) {
                    this.authenticateSpotify();
                }
            });


    }

    leaveButtonPressed() {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        };
        fetch('/api/leave-room', requestOptions)
            .then((_response) => {
                this.props.leaveRoomCallback();
                this.props.history.push('/');
            });
    }

    authenticateSpotify() {
        fetch('/spotify/is-authenticated')
            .then((response) => response.json())
            .then((data) => {
                this.setState({spotifyAuthenticated: data.status});
                if (!data.status) {
                    fetch('/spotify/get-auth-url')
                        .then((response) => response.json())
                        .then((data) => {
                            window.location.replace(data.url);
                        })
                }
            });
    }

    getCurrentSong() {
        fetch('/spotify/current-song')
            .then((response) => {
                if (!response.ok || response.status === 204) {
                    return {};
                } else {
                    return response.json();
                }
            })
            .then((data) => {
                this.setState({song: data});
            });
    }

    isEmpty(obj) {
        for (const prop in obj) {
            if (Object.hasOwn(obj, prop)) {
                return false;
            }
        }
        return true;
      }

    render() {
        if (this.state.showSettings) {
            return this.renderSettings();
        }
        return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code: {this.roomCode}
                </Typography>
            </Grid>
            <MusicPlayerFunctional {...this.state.song} nonePlaying={this.isEmpty(this.state.song)}/>
            {this.state.isHost ? this.renderSettingsButton() : null}
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={this.leaveButtonPressed}>
                    Leave Room
                </Button>
            </Grid>
        </Grid>
        )
    }

}