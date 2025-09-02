import React, { useMemo, useRef, useEffect, useState } from "react";
import { Flex } from "../components/common/Flex";
import { useFrontPageStore } from "../store/FrontPageStore";
import FrontPage from "../components/frontpage/FrontPage";
import { useShallow } from "zustand/shallow";
import CreateRoom from "../components/frontpage/CreateRoom";
import JoinRoom from "../components/frontpage/JoinRoom";
import Login from "../components/frontpage/Login";
import { PageGrid } from "../components/common/PageGrid";

const LOGO_ANIMATION_PERIOD_SECONDS = 2;

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

  // opt to use the style prop here instead of styled components so we don't
  // create a new styling every time the animated position changes
  return (
    <img
      src={src}
      style={{
        aspectRatio: "1",
        width: "256px",
        transform: `translateY(${y}px)`,
        transition: "transform 0.05s linear",
      }}
    />
  );
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
