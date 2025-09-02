export const setFullscreen = () => {
  // set html, body, root heights to 100%
  document.documentElement.style.height = "100%";
  document.body.style.height = "100%";
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.style.height = "100%";
  }
};
