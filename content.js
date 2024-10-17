const CONSTANTS = {
  AVOID_SHORTS: "avoid_shorts",
};

const URLS = {
  YOUTUBE_SHORTS: "https://www.youtube.com/shorts/",
  TIKTOK: "https://www.tiktok.com/",
  INSTAGRAM: "https://www.instagram.com/",
  X: "https://x.com/",
};

const notification = document.createElement("div");
notification.style.position = "fixed";
notification.style.top = "0";
notification.style.left = "0";
notification.style.width = "100%";
notification.style.height = "50px";
notification.style.backgroundColor = "red";
notification.style.color = "white";
notification.style.display = "flex";
notification.style.justifyContent = "center";
notification.style.alignItems = "center";
notification.style.zIndex = "9999";
notification.innerHTML =
  "Get the fuck out of this page and start doing something productive";

function avoidShorts() {
  const url = window.location.href;

  if (url.startsWith(URLS.YOUTUBE_SHORTS)) {
    location.href = "https://www.youtube.com/";
    // window.open("https://www.google.com", "_self");
  }

  if (url.startsWith(URLS.TIKTOK)) {
    console.log("CLOSING WINDOW");
    document.body.innerHTML = "";
    document.body.appendChild(notification);
  }
  if (url.startsWith(URLS.INSTAGRAM)) {
    console.log("CLOSING WINDOW");
    document.body.innerHTML = "";
    document.body.appendChild(notification);
  }
  if (url.startsWith(URLS.X)) {
    console.log("CLOSING WINDOW");
    document.body.innerHTML = "";
    document.body.appendChild(notification);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === CONSTANTS.AVOID_SHORTS) {
    avoidShorts();
  }
});
