import React, { useMemo, useRef, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Flex } from "../components/common/Flex";
import { useFrontPageStore } from "../store/FrontPageStore";
import FrontPage from "../components/frontpage/FrontPage";
import { useShallow } from "zustand/shallow";
import CreateRoom from "../components/frontpage/CreateRoom";
import JoinRoom from "../components/frontpage/JoinRoom";
import Login from "../components/frontpage/Login";
import { PageGrid } from "../components/common/PageGrid";

const LOGO_ANIMATION_PERIOD_SECONDS = 2;

const StyledImg = styled.img<{ y: number }>`
  aspect-ratio: 1;
  width: 256px;
  transform: translateY(${(props) => props.y}px);
  transition: transform 0.1s linear;
`;

const SineImg: React.FC<{ src: string }> = ({ src }) => {
  const [y, setY] = useState(0);
  const start = useRef(performance.now());
  const [amplitude, setAmplitude] = useState(0);

  useEffect(() => {
    const updateAmplitude = () => {
      setAmplitude(window.innerHeight * 0.1);
    };
    updateAmplitude();
    window.addEventListener("resize", updateAmplitude);
    return () => window.removeEventListener("resize", updateAmplitude);
  }, []);

  useEffect(() => {
    let frame: number;
    const animate = (now: number) => {
      const elapsed = (now - start.current) / 1000;
      const newY =
        Math.sin((2 * Math.PI * elapsed) / LOGO_ANIMATION_PERIOD_SECONDS) *
        amplitude;
      setY(newY);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [amplitude]);

  return <StyledImg src={src} y={y} />;
};

const Main: React.FC = () => {
  const [stage] = useFrontPageStore(useShallow((state) => [state.stage]));

  const page = useMemo(() => {
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
    <PageGrid hideHeader>
      <Flex width="100%" gap="10%" justifyContent="center">
        {page}
        <SineImg src="/static/houseparty.png" />
      </Flex>
    </PageGrid>
  );
};

export default Main;
