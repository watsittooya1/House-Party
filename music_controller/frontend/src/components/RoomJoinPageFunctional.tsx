import React, { ChangeEvent, useState } from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

const StyledGridItem = styled(Grid)`
  size: {
    xs: 12;
  }
  align-items: center;
`;

const RoomJoinPageFunctional: React.FC = () => {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function roomButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: roomCode.toUpperCase(),
      }),
    };
    fetch("/api/join-room", requestOptions)
      .then((response) => {
        if (response.ok) {
          navigate(`/room/${roomCode.toUpperCase()}`);
        } else {
          setError("Room not found");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function changeRoomCodeQuery(e: ChangeEvent<HTMLInputElement>) {
    setError("");
    setRoomCode(e.target.value);
  }

  return (
    <Grid container spacing={1}>
      <StyledGridItem>
        <Typography variant="h4" component="h4">
          Join a Room
        </Typography>
      </StyledGridItem>
      <StyledGridItem>
        {error === "" ? (
          <TextField
            label="Room Code"
            value={roomCode}
            variant="outlined"
            onChange={changeRoomCodeQuery}
          />
        ) : (
          <TextField
            error
            label="Room Code"
            value={roomCode}
            helperText={error}
            variant="outlined"
            onChange={changeRoomCodeQuery}
          />
        )}
      </StyledGridItem>
      <StyledGridItem>
        <Button variant="contained" color="primary" onClick={roomButtonPressed}>
          Enter Room
        </Button>
      </StyledGridItem>
      <StyledGridItem>
        <Button variant="contained" color="secondary" to="/" component={Link}>
          Back
        </Button>
      </StyledGridItem>
    </Grid>
  );
};

export default RoomJoinPageFunctional;
