import React, { useState, useEffect } from 'react';
import {
    Grid,
    Button,
    Typography,
    Container,
    TextField,
    Collapse,
    Alert
} from "@mui/material";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
    variant: "outlined",
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(0.5),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }));

export default function QueueMenu(props) { 
    const [trackQuery, setTrackQuery] = useState("");
    const [trackList, setTrackList] = useState([]);
    const [searchError, setSearchError] = useState("");
    const [selectedTrackUri, setSelectedTrackUri] = useState("");
    const [_successMsg, setSuccessMsg] = useState("");
    const [_errorMsg, setErrorMsg] = useState("");

    const closeMenuCallback = props.closeMenuCallback;

    function changeTrackQuery(e) {
        setSearchError("");
        setTrackQuery(e.target.value);
    }
    function executeTrackSearch() {
        if (trackQuery === "") {
            setSearchError("Enter a search query.");
            return;
        }
        fetch(`/spotify/search-track?track=${trackQuery.toString()}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.length == 0) {
                    setSearchError("No search results.");
                } else {
                    for (let i=0; i<data.length; i++) {
                        data[i].selected = false;
                    }
                    setTrackList(data);
                }
            });

    }

    function handleTrackSelect(songUri) {
        const trackListCopy = [...trackList];
        for (let i=0; i<trackListCopy.length; i++) {
            if (trackListCopy[i].uri == songUri) {
                trackListCopy[i].selected = true;
                setSelectedTrackUri(songUri);
            } else {
                trackListCopy[i].selected = false;
            }
        }
    }

    function queueTrack() {
        if (selectedTrackUri === "") {
            setErrorMsg("You must select a track to queue.");
            return;
        }
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          };
        const url = `/spotify/add-to-queue?uri=${selectedTrackUri.toString()}`
        fetch(url, requestOptions)
            .then((response) => response.json())
            .then(() => {
                setSuccessMsg("Song queued successfully!");
                });

    }

    function renderSearchBar() {
        return (
            <Grid container spacing={2} sx={{ mt:1 }} alignItems="center" justifyContent="center">
                <Grid item align="center">
                    { (searchError === ""
                        ? <TextField fullWidth id="outlined-basic" onChange={changeTrackQuery} label="Search a track name" variant="outlined" />
                        : <TextField error fullWidth id="outlined-basic" onChange={changeTrackQuery} label="Search a track name" variant="outlined" helperText={searchError} />
                    )}
                </Grid>
                <Grid item align="center">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={executeTrackSearch}>
                        Search
                    </Button>
                </Grid>
            </Grid>
        );
    }

    function renderTrackList() {
        return (
            <Grid container alignItems="stretch" spacing={2}>
                { trackList.map((song)=>(
                    <Grid item key={song.uri} xs={3}>
                        <Button variant={song.selected ? "contained" : "outlined"} onClick={() => handleTrackSelect(song.uri)} sx={{
                            padding: 1,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <div>
                                <img src={song.image.url} width="100"/>
                                
                                <Typography color="textPrimary" variant="subtitle2">
                                    {song.name}
                                </Typography>
                                <Typography color="textSecondary" variant="caption">
                                    {song.artists.join(", ")}
                                </Typography>
                            </div>
                        </Button>
                    </Grid>
                    ))}
            </Grid>

        );

    }

    return (
        <div>
            <Grid container spacing={3} sx={{mb:10}} justifyContent="center">
                <Grid item xs={12} align="center">
                    {renderSearchBar()}
                </Grid>
                {(trackList.length !== 0)
                    ? (
                        <Grid item xs={12} align="center"> 
                            {renderTrackList()}
                        </Grid>)
                    : null }
                <Grid item xs={12} align="center">
                    <Grid container spacing={1} justifyContent="center">
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={queueTrack}>
                                Add to Queue
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={closeMenuCallback}>
                                Close
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6} align="center">
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
            </Grid>
        </div>
    );

}