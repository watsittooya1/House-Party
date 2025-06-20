import React, { useState } from "react";
import { Divider, IconButton } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import styled from "@emotion/styled";
import { Flex } from "../../../components/common/Flex";
import { Page } from "../../../components/common/Page";
import colorScheme from "../../../utility/colorScheme";
import { useQueryParams } from "../../../utility/queryParams";
import MusicPlayer from "../../../components/room/MusicPlayer";
import Queue from "../../../components/room/Queue";
import Menu from "../../../components/room/Menu";
import QueueMenu from "../../../components/room/QueueMenu";

const StyledRight = styled(KeyboardArrowRightIcon)`
  color: ${colorScheme.gray};
  font-size: 50px;
`;

const ColoredDivider = styled(Divider)`
  border-color: ${colorScheme.gray};
  border-width: 1px;
`;

const MenuPosition = styled(Flex)`
  position: absolute;
  top: 50%;
`;

// todo: find a better way to eval this
const StyledMusicPlayer = styled(MusicPlayer)<{ showQueue: boolean }>`
  width: ${({ showQueue }) => (showQueue ? "75%" : "100%")};
`;

const Room: React.FC = () => {
  const [showQueue] = useQueryParams(["showQueue"]);
  const [onQueueMenu] = useQueryParams(["onQueueMenu"]);
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  return (
    <Page margin="3%" gap="3%">
      <MenuPosition>
        {menuIsOpen ? (
          <Menu closeMenuCallback={() => setMenuIsOpen(false)} />
        ) : (
          <IconButton onClick={() => setMenuIsOpen(true)}>
            <StyledRight />
          </IconButton>
        )}
      </MenuPosition>
      {onQueueMenu ? (
        <QueueMenu closeMenuCallback={() => {}} />
      ) : (
        <StyledMusicPlayer showQueue={showQueue === "true"} />
      )}
      {showQueue ? (
        <>
          <ColoredDivider orientation="vertical" variant="middle" flexItem />
          <Queue />
        </>
      ) : null}
    </Page>
  );
};

export default Room;
