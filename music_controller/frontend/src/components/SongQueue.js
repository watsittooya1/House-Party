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

    useEffect(() => {
        checkQueue();
    }, []);

    useEffect(() => {
        const interval = setInterval(checkQueue, 3000);
        return (() => clearInterval(interval));
    });

    async function checkQueue() {
        // ensure response is OK
        await fetch('/api/user-in-room')
            .then((response) => response.json())
            .then(async (data) => {
                if (data.code) {
                    setHidden(false);
                    await fetch('/spotify/get-queue')
                        .then((response) => {
                            // if (response.status == 205) {
                            //     return [];
                            // } else if (!response.ok || response.status === 204) {
                            //     return [];
                            // }
                            // return response.json();
                            if (response.status == 200) {
                                return response.json();
                            } else {
                                return [];
                            }
                        })
                        .then((data) => {
                            setQueue(data);
                        });
                        
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
                        // gives a random string suffix to song id, to prevent duplicate key id
                        <div key={`${song.id}_randomstring-${(Math.random() + 1).toString(36).substring(4)}`}>
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