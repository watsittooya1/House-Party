import React, { useState, useEffect } from "react";
import { Grid, Button, Typography, Toolbar, IconButton, AppBar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link } from "react-router-dom";


export default function AuthBar(props) {

    //const [page, setPage] = useState(pages.ABOUT);

    return (
        <AppBar className="appbar">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    House Party
                </Typography>
                <Button color="inherit">Logged in as ...</Button>
            </Toolbar>


        </AppBar>
        );
}