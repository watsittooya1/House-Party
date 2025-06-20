import React from "react";
import { IconButton, LinearProgress } from "@mui/material";
import styled from "@emotion/styled";
import { Flex } from "../../components/common/Flex";
import StyledText from "../../components/common/StyledText";
import LogoHeader from "../../components/common/LogoHeader";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PauseIcon from "@mui/icons-material/Pause";
import colorScheme from "../../utility/colorScheme";

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

const RoomContainer = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 10% 40% 10%;
  gap: 15%;
  //margin: 5%;
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

// rename this
const AllContainer = styled(Flex)`
  margin: 3%;
`;

const MusicPlayer: React.FC = () => {
  return (
    // todo: configure width movement
    <AllContainer //width={showQueue ? "75%" : "100%"}
      height="100%"
    >
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
  );
};

export default MusicPlayer;
