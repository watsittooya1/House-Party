import React, { useState, useEffect } from 'react';
import {
    Grid,
    Typography,
    Card,
    Divider,
    List,
    ListItem,
    ListItemAvatar
  } from "@mui/material";


export default function SongQueue(props) {
 
    const [hidden, setHidden] = useState(true);
    const [queue, setQueue] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthentication();
        checkQueue();
    }, []);

    useEffect(() => {
        const interval = setInterval(checkQueue, 3000);
        return (() => clearInterval(interval));
    });

    function checkAuthentication() {
        fetch('/spotify/is-authenticated')
        .then((response) => response.json())
        .then((data) => {
            setIsAuthenticated(data.status);
            }
        )
    }

    async function checkQueue() {
        // ensure response is OK
        await fetch('/api/user-in-room')
            .then((response) => response.json())
            .then(async (data) => {
                if (data.code) {
                    setHidden(false);
                    if (isAuthenticated) {
                        await fetch('/spotify/get-queue')
                            .then((response) => response.json())
                            .then((data) => {
                                setQueue(data);
                            });
                        }
                } else {
                    setHidden(true);
                }
            });
    }

    if (hidden) {
        return null;
    }
    return (
        <Card width="100%">
            <Typography component="h5" variant="h5" align="center" margin="5px" height="3vh">Next In Queue</Typography>
            <Divider />
            <List className="scrollable" sx={{
                pt:0,
            }}>
                {queue
                    ? queue.map((song)=>(
                        <div key={song.id}>
                            <ListItem sx={{pl:0}}>
                                <ListItemAvatar height="100%">
                                    <img src={song.image.url} width="50"/>
                                </ListItemAvatar>
                                <div>
                                    <Typography component="h6" variant="h6">
                                            {song.name}
                                    </Typography>
                                    <Typography color="textSecondary" variant="subtitle2">
                                        {song.artists.join(", ")}
                                    </Typography>
                                </div>
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </div>))
                        : null}
            </List>
        </Card>

    );

}