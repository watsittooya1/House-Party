import React, { useState, useEffect } from "react";
import { Button, Typography, Toolbar, IconButton, AppBar, Box } from "@mui/material";
import LogoImage from "../favicon.png";


export default function AuthBar(props) {

    const [userName, setUserName] = useState("");

    useEffect(() => {
        GetUserName();
    }, [])

    function GetUserName() {
        fetch('/spotify/get-user-name')
            .then((response) => response.json())
            .then((data) => {
                setUserName(data.username);
            })
    }

    function ShowDialog() {

        fetch(`/spotify/get-auth-url?show-dialog=${true}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data.url);
                window.location.replace(data.url);
                });
    }

    function HomeButtonPressed() {
        window.location.replace("/");
    }

    return (
        <AppBar className="appbar">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={ HomeButtonPressed }
                    >
                    <Box
                        component="img"
                        sx={{
                            height: 32,
                            width: 32,
                        }}
                        alt="house party logo"
                        src={LogoImage}
                        />
                    <Typography variant="h6" component="div" sx={{ml: 1}}>
                        House Party
                    </Typography>
                </IconButton>
                <Box sx={{flexGrow: 1}} />
                <Button
                    color="inherit"
                    onClick={ShowDialog}>
                        { userName
                        ? `Logged in as ${userName}`
                        : "Not logged in"
                        }
                    </Button>
            </Toolbar>


        </AppBar>
        );
}