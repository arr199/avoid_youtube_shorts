const CONSTANTS = {
  AVOID_SHORTS: "avoid_shorts",
};

const URLS = {
  YOUTUBE_SHORTS: "https://www.youtube.com/shorts/",
};

function avoidShorts() {
  const url = window.location.href;
  if (url.startsWith(YOUTUBE_SHORTS)) {
    location.href = "https://www.youtube.com/";
    // window.open("https://www.google.com", "_self");
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === CONSTANTS.AVOID_SHORTS) {
    avoidShorts();
  }
});
