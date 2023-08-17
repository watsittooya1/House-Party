import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import { Link, useHistory } from "react-router-dom";

export default function RoomJoinPageFunctional(props) {

    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState("");
    const history = useHistory();

    
    function roomButtonPressed() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                code: roomCode
            })
        };
        fetch('/api/join-room', requestOptions)
            .then((response) => {
                if (response.ok) {
                    history.push(`/room/${roomCode}`)
                } else {
                    setError("Room not found");
                }
            })
            .catch((error) => {console.log(error)});
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Join a Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <TextField
                    error={ error }
                    label="Code"
                    placeholder="Enter a Room Code"
                    value={ roomCode }
                    helperText= { error }
                    variant="outlined"
                    onChange={(e) => setRoomCode(e.target.value)}
                    />
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={roomButtonPressed}>
                    Enter Room
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>
    );
}