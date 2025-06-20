/// <reference types="spotify-web-playback-sdk" />
import React from "react";
import styled from "@emotion/styled";
import { Flex } from "../../components/common/Flex";
import StyledText from "../../components/common/StyledText";
import { testTrackList } from "../../utility/testTracks";

const QueueContainer = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 10% 90%;
`;

const Queue: React.FC = () => {
  return (
    <Flex direction="column" width="25%" height="100%">
      <QueueContainer>
        <Flex>
          <StyledText name="header">Queue</StyledText>
        </Flex>
        <Flex direction="column" justifyContent="start">
          {testTrackList
            ? testTrackList.map((song) => (
                // gives a random string suffix to song id, to prevent duplicate key id
                <div
                  key={`${song.id}_randomstring-${(Math.random() + 1)
                    .toString(36)
                    .substring(4)}`}
                >
                  <Flex>
                    <Flex>
                      <img src={"../../public/heartbreakhits.jpg"} width="50" />
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
  );
};

export default Queue;
