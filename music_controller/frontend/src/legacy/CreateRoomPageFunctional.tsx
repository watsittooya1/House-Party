import React, { type ChangeEvent, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Collapse, Alert } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import styled from "@emotion/styled";

const StyledGridItem = styled(Grid)`
  size: {
    xs: 12;
  }
  align-items: center;
`;

const centeredFormHelpers = createTheme({
  components: {
    // Name of the component
    MuiFormHelperText: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          textAlign: "center",
        },
      },
    },
  },
});

const CreateRoomPageFunctional: React.FC<{
  votesToSkip: number;
  guestCanPause: boolean;
  guestCanQueue: boolean;
  update: boolean;
  roomCode: string | undefined;
  updateCallback: () => void;
}> = ({
  votesToSkip = 2,
  guestCanPause = true,
  guestCanQueue = true,
  update = false,
  roomCode = null,
  updateCallback = () => {},
}) => {
  const [_guestCanPause, setGuestCanPause] = useState(guestCanPause);
  const [_guestCanQueue, setGuestCanQueue] = useState(guestCanQueue);
  const [_votesToSkip, setVotesToSkip] = useState(votesToSkip);
  const [_errorMsg, setErrorMsg] = useState("");
  const [_successMsg, setSuccessMsg] = useState("");

  const title = update ? "Update Room" : "Create Room";
  const navigate = useNavigate();

  function handleVotesChange(e: ChangeEvent<HTMLInputElement>) {
    setVotesToSkip(parseInt(e.target.value));
  }

  function handleGuestCanPauseChange(e: ChangeEvent<HTMLInputElement>) {
    setGuestCanPause(e.target.value === "true");
  }

  function handleGuestCanQueueChange(e: ChangeEvent<HTMLInputElement>) {
    setGuestCanQueue(e.target.value === "true");
  }

  function handleRoomButtonPressed() {
    //sending request to endpoint
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: _votesToSkip,
        guest_can_pause: _guestCanPause,
        guest_can_queue: _guestCanQueue,
      }),
    };
    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => navigate("/room/" + data.code));
  }

  function handleUpdateButtonPressed() {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: _votesToSkip,
        guest_can_pause: _guestCanPause,
        guest_can_queue: _guestCanQueue,
        code: roomCode,
      }),
    };
    fetch("/api/update-room", requestOptions).then((response) => {
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
        <Grid
          size={{ xs: 12 }} //align="center"
        >
          <Button
            color="primary"
            variant="contained"
            onClick={handleRoomButtonPressed}
          >
            Create a Room
          </Button>
        </Grid>
        <Grid
          size={{ xs: 12 }} //align="center"
        >
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  }

  function renderUpdateButtons() {
    return (
      <Grid
        size={{ xs: 12 }} //align="center"
      >
        <Button
          color="primary"
          variant="contained"
          onClick={handleUpdateButtonPressed}
        >
          Update Room
        </Button>
      </Grid>
    );
  }

  return (
    <ThemeProvider theme={centeredFormHelpers}>
      <Grid container spacing={1}>
        <StyledGridItem>
          <Collapse in={_errorMsg != "" || _successMsg != ""}>
            {_successMsg != "" ? (
              <Alert
                severity="success"
                onClose={() => {
                  setSuccessMsg("");
                }}
              >
                {_successMsg}
              </Alert>
            ) : (
              <Alert
                severity="error"
                onClose={() => {
                  setErrorMsg("");
                }}
              >
                {_errorMsg}
              </Alert>
            )}
          </Collapse>
        </StyledGridItem>
        <StyledGridItem>
          <Typography component="h4" variant="h4">
            {title}
          </Typography>
        </StyledGridItem>
        <StyledGridItem>
          <FormControl component="fieldset">
            <FormHelperText>Guest Control of Playback State</FormHelperText>
            <RadioGroup
              row
              defaultValue={guestCanPause.toString()}
              onChange={handleGuestCanPauseChange}
            >
              <FormControlLabel
                value="true"
                control={<Radio color="primary" />}
                label="Play/Pause"
                labelPlacement="bottom"
              />
              <FormControlLabel
                value="false"
                control={<Radio color="primary" />}
                label="No Control"
                labelPlacement="bottom"
              />
            </RadioGroup>
          </FormControl>
        </StyledGridItem>
        <StyledGridItem>
          <FormControl component="fieldset">
            <FormHelperText>Guest Ability to Queue Songs</FormHelperText>
            <RadioGroup
              row
              defaultValue={guestCanQueue.toString()}
              onChange={handleGuestCanQueueChange}
            >
              <FormControlLabel
                value="true"
                control={<Radio color="primary" />}
                label="Can Queue"
                labelPlacement="bottom"
              />
              <FormControlLabel
                value="false"
                control={<Radio color="primary" />}
                label="Cannot"
                labelPlacement="bottom"
              />
            </RadioGroup>
          </FormControl>
        </StyledGridItem>
        <StyledGridItem>
          <FormControl>
            <FormHelperText>Votes Required to Skip Song</FormHelperText>
            <TextField
              required={true}
              type="number"
              defaultValue={_votesToSkip}
              inputProps={{
                min: 1,
                style: { textAlign: "center" },
              }}
              onChange={handleVotesChange}
            />
          </FormControl>
        </StyledGridItem>
        <StyledGridItem>
          {update ? renderUpdateButtons() : renderCreateButtons()}
        </StyledGridItem>
      </Grid>
    </ThemeProvider>
  );
};

export default CreateRoomPageFunctional;
