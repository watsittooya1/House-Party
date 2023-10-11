import React, { useState, useEffect } from "react";
import { Grid, Button, Typography, IconButton, formHelperTextClasses } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link } from "react-router-dom";


const pages = {
    NOTE: "pages.note",
    ABOUT: "pages.about",
    JOIN: "pages.join",
    CREATE: "pages.create",
    EXTRA: "pages.extra"
};

export default function Info(props) {

    const [page, setPage] = useState(pages.NOTE);

    function noteInfo() {
        return "(NOTE: This app is in development mode, and as per Spotify's terms, cannot be moved into"
        + " extended quota mode as it is a hobby project. As a result, you unfortunately won't be able to"
        + " host a room without me (Chris Yun) having adding your email to the app whitelist. If you're a "
        + "recruiter, I'd be happy to do so do show you the app's functionality!)";
    }
    
    function aboutInfo() {
        return "House Party is a "
        + "web-app made to allow you and your friends to create a shared radio"
        + " using only one Spotify premium account! If you didn't know already, Spotify's own 'Shared"
        + " Radio' feature is known to be buggy and unaccomodating at times. Thus House Party can be "
        + "your readily available substitute."
    }
    function joinInfo() {
        return "To join a page, enter the code at the top of a hosted room. You'll then be able, depen"
        + "ding on room settings, to control playback, queue songs, or skip tracks.";
    }
    function createInfo() {
        return "Creating and hosting a room will require you to log in to Spotify Premium. "
        + "Afterwards, you can configure settings for whether guests can control playback, queue so"
        + "gs, or skip tracks. You'll also be given a randomly generated room code. Disbanding the "
        + "room closes it for all, so be careful!";
    }
    function extraInfo() {
        return "Notes: To allow House Party to actually play audio, the host will have to connect their"
        + " account to the 'Spotify Web SDK' device. Because Spotify allows accounts to stream on only one"
        + " platform at a time, only the host will have music playing; others will only be able to control"
        + " the playback and queue.";
    }

    function renderInfo() {

        let pageToRender;
        switch (page) {
            case pages.NOTE:
                pageToRender = noteInfo();
                break;
            case pages.ABOUT:
                pageToRender = aboutInfo();
                break;
            case pages.CREATE:
                pageToRender = createInfo();
                break;
            case pages.JOIN:
                pageToRender = joinInfo();
                break;
            case pages.EXTRA:
                pageToRender = extraInfo();
                break;
        }

        return (
            <Grid item xs={12} align="center">
                <Typography variant="body1">
                    { pageToRender }
                </Typography>
            </Grid>
        );
    }

    function renderButtons() {
        const sequence = [pages.NOTE, pages.ABOUT, pages.CREATE, pages.JOIN, pages.EXTRA]
        const currentPage = sequence.indexOf(page);
        const prevPage = sequence[(currentPage + (sequence.length - 1)) % (sequence.length)]
        const nextPage = sequence[(currentPage + 1) % (sequence.length)]

        return (
            <Grid item xs={12} align="center">
                <div className="hzlayout">
                    <IconButton onClick={() => {setPage(prevPage);}}>
                        <NavigateBeforeIcon />
                    </IconButton>
                    <Typography>
                        {currentPage + 1}
                    </Typography>
                    <IconButton onClick={() => {setPage(nextPage)}}>
                        <NavigateNextIcon />
                    </IconButton>
                    
                </div>
            </Grid>
        );
    }

    return (
        <Grid container width="50%" margin="auto" spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    What is House Party?
                </Typography>
            </Grid>
            {renderInfo()}
            {renderButtons()}
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>
    );
}

