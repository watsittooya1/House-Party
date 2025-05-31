import { ChangeEvent, useCallback, useState } from "react";
import {
  Grid,
  Button,
  Typography,
  TextField,
  Collapse,
  Alert,
} from "@mui/material";
import styled from "@emotion/styled";

type Props = {
  isAuthenticated: boolean;
  closeMenuCallback: () => void;
};

const CenteredGridItem = styled(Grid)`
  size: {
    xs: 12;
  }
  align-items: center;
`;

const StyledGridItem = styled(Grid)<{ xsWidth?: number }>`
  size: {
    xs: ${({ xsWidth = 12 }) => xsWidth};
  }
  align-items: center;
`;

const QueueMenu: React.FC<Props> = ({ isAuthenticated, closeMenuCallback }) => {
  const [trackQuery, setTrackQuery] = useState("");
  const [trackList, setTrackList] = useState([]);
  const [searchError, setSearchError] = useState("");
  const [selectedTrackUri, setSelectedTrackUri] = useState("");
  const [_successMsg, setSuccessMsg] = useState("");
  const [_errorMsg, setErrorMsg] = useState("");

  function changeTrackQuery(e: ChangeEvent<HTMLInputElement>) {
    setSearchError("");
    setTrackQuery(e.target.value);
  }

  function executeTrackSearch() {
    if (!isAuthenticated) {
      setSearchError("Host must be logged in.");
      return;
    }
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
          for (let i = 0; i < data.length; i++) {
            data[i].selected = false;
          }
          setTrackList(data);
        }
      });
  }

  const handleTrackSelect = useCallback(
    (songUri: string) => {
      const trackListCopy = [...trackList];
      for (let i = 0; i < trackListCopy.length; i++) {
        if (trackListCopy[i].uri == songUri) {
          trackListCopy[i].selected = true;
          setSelectedTrackUri(songUri);
        } else {
          trackListCopy[i].selected = false;
        }
      }
    },
    [trackList, setSelectedTrackUri]
  );

  const queueTrack = useCallback(() => {
    if (selectedTrackUri === "") {
      setErrorMsg("You must select a track to queue.");
      return;
    }
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    const url = `/spotify/add-to-queue?uri=${selectedTrackUri.toString()}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then(() => {
        setSuccessMsg("Song queued successfully!");
      });
  }, [selectedTrackUri, setSuccessMsg, setErrorMsg]);

  function renderSearchBar() {
    return (
      <Grid
        container
        spacing={2}
        sx={{ mt: 1 }}
        alignItems="center"
        justifyContent="center"
      >
        <CenteredGridItem>
          {searchError === "" ? (
            <TextField
              fullWidth
              id="outlined-basic"
              onChange={changeTrackQuery}
              label="Search a track name"
              variant="outlined"
            />
          ) : (
            <TextField
              error
              fullWidth
              id="outlined-basic"
              onChange={changeTrackQuery}
              label="Search a track name"
              variant="outlined"
              helperText={searchError}
            />
          )}
        </CenteredGridItem>
        <CenteredGridItem>
          <Button
            variant="contained"
            color="primary"
            onClick={executeTrackSearch}
          >
            Search
          </Button>
        </CenteredGridItem>
      </Grid>
    );
  }

  function renderTrackList() {
    return (
      <Grid container alignItems="stretch" spacing={2}>
        {trackList.map((song) => (
          <Grid key={song.uri} size={{ xs: 3 }}>
            <Button
              variant={song.selected ? "contained" : "outlined"}
              onClick={() => handleTrackSelect(song.uri)}
              sx={{
                padding: 1,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div>
                <img src={song.image.url} width="100" />

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
      <Grid container spacing={3} sx={{ mb: 10 }} justifyContent="center">
        <StyledGridItem>{renderSearchBar()}</StyledGridItem>
        {trackList.length !== 0 ? (
          <StyledGridItem>{renderTrackList()}</StyledGridItem>
        ) : null}
        <StyledGridItem>
          <Grid container spacing={1} justifyContent="center">
            <Grid>
              <Button variant="contained" color="primary" onClick={queueTrack}>
                Add to Queue
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="contained"
                color="secondary"
                onClick={closeMenuCallback}
              >
                Close
              </Button>
            </Grid>
          </Grid>
        </StyledGridItem>
        <StyledGridItem xsWidth={6}>
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
      </Grid>
    </div>
  );
};

export default QueueMenu;
