import React from "react";
import { Grid, IconButton, LinearProgress, Stack } from "@mui/material";
import styled from "@emotion/styled";
import { Flex } from "../../components/common/Flex";
import StyledText from "../../components/common/StyledText";
import { Page } from "../../components/common/Page";
import LogoHeader from "../../components/common/LogoHeader";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PauseIcon from "@mui/icons-material/Pause";
import colorScheme from "../../utility/colorScheme";

const AlbumCoverContainer = styled(Flex)`
  width: 30vw;
  height: 30vw;
`;

const StyledSkip = styled(SkipNextIcon)`
  color: ${colorScheme.gray};
`;

const StyledPause = styled(PauseIcon)`
  color: ${colorScheme.gray};
`;

const StyledPlay = styled(PlayArrowIcon)`
  color: ${colorScheme.gray};
`;

const Room: React.FC = () => {
  return (
    <Page>
      <Grid container spacing={2}>
        {/* music player */}
        <Grid>
          <LogoHeader />
          <Stack>
            <Grid container>
              {/* album cover */}
              <Grid>
                <AlbumCoverContainer>
                  <img
                    src="../../static/favicon.png"
                    height="100%"
                    width="100%"
                  />
                </AlbumCoverContainer>
              </Grid>
              {/* song name, album name, artist name */}
              <Grid>
                <Stack>
                  <StyledText name="h4">DO AS THE ROMANS DO</StyledText>
                  <StyledText name="h4">HEARTBREAK HITS</StyledText>
                  <StyledText name="h4">THEO KATZMAN</StyledText>
                  <div>
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
                      <StyledText name="p">5/7</StyledText>
                      {/* {song!.votes} / {song!.votes_required} */}
                      <StyledSkip />
                    </IconButton>
                  </div>
                </Stack>
              </Grid>
            </Grid>
            <LinearProgress variant="determinate" value={35} />
          </Stack>
        </Grid>
        {/* queue sidebar */}
        <Grid display="flex"></Grid>
      </Grid>
    </Page>
  );
};

export default Room;
