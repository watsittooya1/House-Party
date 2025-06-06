import React, { useMemo } from "react";
import { Grid, Stack } from "@mui/material";
import styled from "@emotion/styled";
import { Flex } from "../components/common/Flex";
import { useFrontPageStore } from "../store/FrontPageStore";
import FrontPage from "../components/frontpage/FrontPage";
import { useShallow } from "zustand/shallow";
import CreateRoom from "../components/frontpage/CreateRoom";
import JoinRoom from "../components/frontpage/JoinRoom";
import Login from "../components/frontpage/Login";
import StyledText from "../components/common/StyledText";
import { Page } from "../components/common/Page";

const LogoFlex = styled(Flex)`
  width: 50px;
  height: 50px;
`;

const Main: React.FC = () => {
  const [stage] = useFrontPageStore(useShallow((state) => [state.stage]));

  const buttonInterface = useMemo(() => {
    switch (stage) {
      case "FrontPage":
        return <FrontPage />;
      case "Login":
        return <Login />;
      case "CreateRoom":
        return <CreateRoom />;
      case "JoinRoom":
        return <JoinRoom />;
    }
  }, [stage]);

  return (
    <Page>
      <Grid container spacing={2}>
        <Grid>{buttonInterface}</Grid>
        <Grid display="flex" alignItems="center" justifyContent="center">
          <Stack alignItems="center">
            <LogoFlex>
              {/* todo: replace this image with a higher res image */}
              <img src="/static/favicon.png" />
            </LogoFlex>
            <StyledText name="h4">House Party!</StyledText>
          </Stack>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Main;
