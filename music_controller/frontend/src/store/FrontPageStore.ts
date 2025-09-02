import { create } from "zustand";

export type FrontPageStage = "FrontPage" | "Login" | "CreateRoom" | "JoinRoom";

type FrontPageState = {
  setStage: (stage: FrontPageStage) => void;
  stage: FrontPageStage;
};

export const useFrontPageStore = create<FrontPageState>()((set) => ({
  setStage: (stage: FrontPageStage) =>
    set((state) => ({
      ...state,
      stage: stage,
    })),
  stage: "FrontPage",
}));
