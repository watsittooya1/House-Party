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

  const loginLabel = useMemo(
    () =>
      isLoading || isError || data?.username == null
        ? "Not logged in"
        : `Logged in as ${data.username}`,

    [isLoading, isError, data]
  );

  const showLoginDialog = useCallback(() => {
    triggerGetAuthUrl()
      .unwrap()
      .then((resp) => window.location.replace(resp.url));
  }, [triggerGetAuthUrl]);

  return (
    <Flex width="316px" gap="30px" direction="column">
      <TitleContainer justifyContent="center">
        <StyledText name="title">house party!</StyledText>
      </TitleContainer>
      <Flex direction="column">
        <StyledButton onClick={showLoginDialog}>login to spotify</StyledButton>
        <StyledText name="subtitle">{loginLabel}</StyledText>
      </Flex>
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
