import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { Flex } from "../../components/common/Flex";
import colorScheme from "../../utility/colorScheme";
import { StyledButton } from "../../components/common/StyledButton";
import {
  useGetCurrentRoomQuery,
  useLeaveRoomMutation,
} from "../../api/housePartyApi";

const MenuContainer = styled(Flex)`
  background-color: ${colorScheme.darkGray};
`;

const Menu: React.FC<{ closeMenuCallback: () => void }> = ({
  closeMenuCallback,
}) => {
  const { data, isLoading } = useGetCurrentRoomQuery();
  const [leaveRoom] = useLeaveRoomMutation();

  const handleLeaveRoom = useCallback(async () => {
    await leaveRoom();
  }, [leaveRoom]);

  const handlePrintRoom = useCallback(() => {
    if (isLoading) {
      console.log("room loading...");
    } else if (data == null) {
      console.log("data is null!");
    } else {
      console.log(`code is ${data.code}`);
    }
  }, [data, isLoading]);

  return (
    <MenuContainer direction="column">
      <StyledButton onClick={closeMenuCallback}>option 1</StyledButton>
      <StyledButton onClick={handlePrintRoom}>get room details</StyledButton>
      <StyledButton onClick={handleLeaveRoom}>close room</StyledButton>
    </MenuContainer>
  );
};

export default Menu;
