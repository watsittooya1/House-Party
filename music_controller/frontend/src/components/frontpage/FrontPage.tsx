import { StyledButton } from "../common/StyledButton";
import { useShallow } from "zustand/shallow";
import { useFrontPageStore } from "../../store/FrontPageStore";
import { useCallback, useMemo } from "react";
import {
  useGetUserNameQuery,
  useLazyGetAuthUrlQuery,
} from "../../api/spotifyApi";
import { Flex } from "../common/Flex";
import StyledText from "../common/StyledText";
import styled from "@emotion/styled";
import colorScheme from "../../utility/colorScheme";

const TitleContainer = styled(Flex)`
  border-bottom: 2px ${colorScheme.gray} solid;
`;

const FrontPage: React.FC = () => {
  const [setStage] = useFrontPageStore(useShallow((state) => [state.setStage]));
  const [triggerGetAuthUrl] = useLazyGetAuthUrlQuery();
  const { data, isLoading, isError } = useGetUserNameQuery();

  const handleLogin = useCallback(() => {
    triggerGetAuthUrl({ showDialog: true })
      .unwrap()
      .then((resp) => window.location.replace(resp.url));
  }, [triggerGetAuthUrl]);

  const AuthButton = useMemo(() => {
    if (isLoading || isError || data?.username == null) {
      return (
        <Flex direction="column">
          <StyledButton onClick={handleLogin}>login to spotify</StyledButton>
        </Flex>
      );
    }
    return (
      <Flex direction="column">
        <StyledButton onClick={handleLogin}>change spotify user</StyledButton>
        <StyledText name="subtitle">{`currently logged in as ${data.username}`}</StyledText>
      </Flex>
    );
  }, [isLoading, isError, data, handleLogin]);
  return (
    <Flex width="316px" gap="30px" direction="column">
      <TitleContainer justifyContent="center">
        <StyledText name="title">house party!</StyledText>
      </TitleContainer>
      {AuthButton}
      <StyledButton onClick={() => setStage("CreateRoom")}>
        start a room
      </StyledButton>
      <StyledButton onClick={() => setStage("JoinRoom")}>
        join a room
      </StyledButton>
    </Flex>
  );
};

export default FrontPage;
