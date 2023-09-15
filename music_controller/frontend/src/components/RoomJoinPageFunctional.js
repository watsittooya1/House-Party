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
                code: roomCode.toUpperCase(),
            })
        };
        fetch('/api/join-room', requestOptions)
            .then((response) => {
                if (response.ok) {
                    history.push(`/room/${roomCode.toUpperCase()}`)
                } else {
                    setError("Room not found");
                }
            })
            .catch((err) => {console.log(err)});
    }

    function changeRoomCodeQuery(e) {
        setError("");
        setRoomCode(e.target.value);
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Join a Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                { (error === ""
                        ? <TextField
                            label="Room Code"
                            value={ roomCode }
                            variant="outlined"
                            onChange={changeRoomCodeQuery} />
                        : <TextField
                            error
                            label="Room Code"
                            value={ roomCode }
                            helperText= { error }
                            variant="outlined"
                            onChange={changeRoomCodeQuery} />
                    )}
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