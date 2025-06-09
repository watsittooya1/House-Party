/// <reference types="spotify-web-playback-sdk" />
import React, { useState } from "react";
import { Divider, IconButton, LinearProgress } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import styled from "@emotion/styled";
import { Flex } from "../../components/common/Flex";
import StyledText from "../../components/common/StyledText";
import { Page } from "../../components/common/Page";
import LogoHeader from "../../components/common/LogoHeader";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PauseIcon from "@mui/icons-material/Pause";
import colorScheme from "../../utility/colorScheme";
import { useQueryParams } from "../../utility/queryParams";
import { StyledButton } from "../../components/common/StyledButton";

const album1: Spotify.Album = {
  name: "album name",
  uri: "",
  images: [],
};

const track1: Spotify.Track = {
  album: album1,
  artists: [],
  duration_ms: 0,
  id: null,
  is_playable: false,
  name: "track name 1",
  uid: "",
  uri: "",
  media_type: "audio",
  type: "track",
  track_type: "audio",
  linked_from: {
    uri: null,
    id: null,
  },
};

const track2: Spotify.Track = {
  album: album1,
  artists: [],
  duration_ms: 0,
  id: null,
  is_playable: false,
  name: "track name 2",
  uid: "",
  uri: "",
  media_type: "audio",
  type: "track",
  track_type: "audio",
  linked_from: {
    uri: null,
    id: null,
  },
};

const queue: Spotify.Track[] = [track1, track2];

const StyledSkip = styled(SkipNextIcon)`
  color: ${colorScheme.gray};
  font-size: 50px;
`;

const StyledPause = styled(PauseIcon)`
  color: ${colorScheme.gray};
  font-size: 50px;
`;

const StyledPlay = styled(PlayArrowIcon)`
  color: ${colorScheme.gray};
  font-size: 50px;
`;

const StyledRight = styled(KeyboardArrowRightIcon)`
  color: ${colorScheme.gray};
  font-size: 50px;
`;

const RoomContainer = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 10% 40% 10%;
  gap: 15%;
  //margin: 5%;
`;

const QueueContainer = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 10% 90%;
`;

const AlbumCoverContainer = styled(Flex)`
  height: 100%;
  align-items: center;
  //aspect-ratio: 1;
`;

const SquareImage = styled.img`
  aspect-ratio: 1;
  width: 100%;
`;

const ColoredDivider = styled(Divider)`
  border-color: ${colorScheme.gray};
  border-width: 1px;
`;

const MusicPlayerLabels = styled.div`
  display: grid;
  grid-template-columns: 40% 60%;
`;

const TrackDetailsContainer = styled(Flex)`
  margin: 3% 5%;
`;

const ButtonsContainer = styled(Flex)`
  margin: 20% auto 10% auto;
  font-size: 50px;
`;

const MenuPosition = styled(Flex)`
  position: absolute;
  top: 50%;
`;

const MenuContainer = styled(Flex)`
  background-color: ${colorScheme.darkGray};
`;

// rename this
const AllContainer = styled(Flex)`
  margin: 3%;
`;

const Room: React.FC = () => {
  const [showQueue] = useQueryParams(["showQueue"]);
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  return (
    <Page margin="3%" gap="3%">
      <MenuPosition>
        {menuIsOpen ? (
          <MenuContainer direction="column">
            <StyledButton onClick={() => setMenuIsOpen(false)}>
              option 1
            </StyledButton>
            <StyledButton>option 1</StyledButton>
            <StyledButton>option 1</StyledButton>
          </MenuContainer>
        ) : (
          <IconButton onClick={() => setMenuIsOpen(true)}>
            <StyledRight />
          </IconButton>
        )}
      </MenuPosition>
      {/* music player, controls width */}
      <AllContainer width={showQueue ? "75%" : "100%"} height="100%">
        <RoomContainer>
          <LogoHeader />
          <MusicPlayerLabels>
            {/* album cover */}
            <AlbumCoverContainer>
              <SquareImage src="../public/heartbreakhits.jpg" />
            </AlbumCoverContainer>
            {/* song name, album name, artist name */}
            <TrackDetailsContainer
              alignItems="flex-start"
              direction="column"
              gap="6%"
            >
              <StyledText name="title">Do As The Romans Do</StyledText>
              <StyledText name="header">Heartbreak Hits</StyledText>
              <StyledText name="body">Theo Katzman</StyledText>
              <ButtonsContainer>
                <IconButton
                //   onClick={() => {
                //     //song!.is_playing ? pauseSong() : playSong();
                //     pauseSong();
                //   }}
                >
                  <StyledPause />
                  <StyledPlay />
                </IconButton>
                <IconButton
                //   onClick={() => {
                //     skipSong();
                //   }}
                >
                  <StyledText name="body">5/7</StyledText>
                  {/* {song!.votes} / {song!.votes_required} */}
                  <StyledSkip />
                </IconButton>
              </ButtonsContainer>
            </TrackDetailsContainer>
          </MusicPlayerLabels>
          <LinearProgress variant="determinate" value={35} />
        </RoomContainer>
      </AllContainer>

      <ColoredDivider orientation="vertical" variant="middle" flexItem />

      {/* queue sidebar */}
      <Flex direction="column" width="25%" height="100%">
        <QueueContainer>
          <Flex>
            <StyledText name="header">Queue</StyledText>
          </Flex>
          <Flex direction="column" justifyContent="start">
            {queue
              ? queue.map((song) => (
                  // gives a random string suffix to song id, to prevent duplicate key id
                  <div
                    key={`${song.id}_randomstring-${(Math.random() + 1)
                      .toString(36)
                      .substring(4)}`}
                  >
                    <Flex>
                      <Flex>
                        <img
                          src={"../../public/heartbreakhits.jpg"}
                          width="50"
                        />
                      </Flex>
                      <Flex direction="column">
                        <StyledText name="body">{song.name}</StyledText>
                        <StyledText name="body">
                          {song.artists.join(", ")}
                        </StyledText>
                      </Flex>
                    </Flex>
                  </div>
                ))
              : null}
          </Flex>
        </QueueContainer>
      </Flex>
    </Page>
  );
};

export default Room;
