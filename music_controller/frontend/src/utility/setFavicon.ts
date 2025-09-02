export const setFavicon = () => {
  const faviconLink = document.createElement("link");
  faviconLink.type = "image/svg+xml";
  faviconLink.rel = "icon";
  faviconLink.href = "../../static/houseparty_small.png";
  const headElement = document.getElementsByTagName("head")[0];
  headElement.appendChild(faviconLink);
};
