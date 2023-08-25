import React, { useState, useEffect } from "react";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import { Collapse, Alert } from "@mui/material";


export default function CreateRoomPageFunctional({
    votesToSkip=2,
    guestCanPause=true,
    guestCanQueue=true,
    update=false,
    roomCode=null,
    updateCallback=()=>{},
}) {

    const [_guestCanPause, setGuestCanPause] = useState(guestCanPause);
    const [_guestCanQueue, setGuestCanQueue] = useState(guestCanQueue);
    const [_votesToSkip, setVotesToSkip] = useState(votesToSkip);
    const [_errorMsg, setErrorMsg] = useState("");
    const [_successMsg, setSuccessMsg] = useState("");

    const title = update ? "Update Room" : "Create Room";
    const history = useHistory();

    function handleVotesChange(e) {
        setVotesToSkip(e.target.value);
    }

    function handleGuestCanPauseChange(e) {
        setGuestCanPause(e.target.value === 'true' ? true : false);
    }

    function handleGuestCanQueueChange(e) {
        setGuestCanQueue(e.target.value === 'true' ? true : false);
    }

    function handleRoomButtonPressed() {
        //sending request to endpoint
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: _votesToSkip,
                guest_can_pause: _guestCanPause,
                guest_can_queue: _guestCanQueue,
            })
        };
        fetch('/api/create-room', requestOptions)
            .then((response) => response.json())
            .then((data) => history.push('/room/' + data.code));
    }

    function handleUpdateButtonPressed() {
        const requestOptions = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: _votesToSkip,
                guest_can_pause: _guestCanPause,
                guest_can_queue: _guestCanQueue,
                code: roomCode
            })
        };
        fetch('/api/update-room', requestOptions)
            .then((response) => {
                if (response.ok) {
                    setSuccessMsg("Room updated successfully!");
                } else {
                    setErrorMsg("Error updating room...");
                }
                updateCallback();
            });
    }

    function renderCreateButtons() {
        return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleRoomButtonPressed}>
                    Create a Room
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button
                    color="secondary"
                    variant="contained"
                    to="/"
                    component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>
        );
    }

    function renderUpdateButtons() {
        return (
            <Grid item xs={12} align="center">
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleUpdateButtonPressed}>
                    Update Room
                </Button>
            </Grid>
        );

    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Collapse in={ _errorMsg != "" || _successMsg != "" }>
                    {_successMsg != ""
                        ? (<Alert
                            severity="success"
                            onClose={() => {setSuccessMsg("")}}>
                                {_successMsg}
                            </Alert>)
                        : (<Alert
                            severity="error"
                            onClose={() => {setErrorMsg("")}}>
                                {_errorMsg}
                            </Alert>)}
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center">Guest Control of Playback State</div>
                    </FormHelperText>
                    <RadioGroup row defaultValue={guestCanPause.toString()} onChange={handleGuestCanPauseChange}>
                        <FormControlLabel
                            value="true"
                            control={<Radio color="primary" />}
                            label="Play/Pause"
                            labelPlacement="bottom"/>
                        <FormControlLabel
                            value="false"
                            control={<Radio color="primary" />}
                            label="No Control"
                            labelPlacement="bottom"/>
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center">Guest Ability to Queue Songs</div>
                    </FormHelperText>
                    <RadioGroup row defaultValue={guestCanQueue.toString()} onChange={handleGuestCanQueueChange}>
                        <FormControlLabel
                            value="true"
                            control={<Radio color="primary" />}
                            label="Can Queue"
                            labelPlacement="bottom"/>
                        <FormControlLabel
                            value="false"
                            control={<Radio color="primary" />}
                            label="Cannot"
                            labelPlacement="bottom"/>
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <FormHelperText>
                        <div align="center">Votes Required to Skip Song</div>
                    </FormHelperText>
                    <TextField
                        required={true}
                        type="number"
                        defaultValue={_votesToSkip}
                        inputProps={{
                            min: 1,
                            style: {textAlign: "center"}
                        }}
                        onChange={handleVotesChange}/>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                {update ? renderUpdateButtons() : renderCreateButtons()}
            </Grid>
        </Grid>
    )
}