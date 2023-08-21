import React, { useState, useEffect } from 'react';

export default function SongQueue(props) {
 
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        checkQueue();
    }, []);

    useEffect(() => {
        const interval = setInterval(checkQueue, 5000);
        return (() => clearInterval(interval));
    });

    async function checkQueue() {
        // ensure response is OK
        await fetch('/spotify/get-queue')
            .then((response) => response.json())
            .then((data) => {
                setQueue(data);
                });
    }

    return (
        <div>
            <ul>
                { queue ? queue.map((song)=>{return <li key={song.id}>{song.name}</li>}) : null }
            </ul>
        </div>
    );




}