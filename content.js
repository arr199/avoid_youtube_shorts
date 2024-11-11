//  TYPES
/**
 * @typedef {Object} UrlCheck
 * @property {string} url - The URL to check.
 * @property {boolean} checked - The status of the check.
 */

const MESSAGES = [
  "Get off this page and go be productive.",
  "Time to close this tab and start doing something worthwhile.",
  "You're still here? Get moving and make the most of your day.",
  "You've got better things to do than staying here. Get to it!",
  "Stop procrastinating and make something awesome happen.",
  "Don’t just sit there, go make some progress on your goals.",
  "Your future self is waiting. Go get things done!",
  "Take a break from this page and go be amazing.",
  "Why are you still here? Get going on those big plans.",
  "Don't just browse aimlessly; go crush your goals.",
  "Time's ticking! Go build something epic.",
  "Success won’t find you here. Get out there and earn it!",
  "Every second counts. Don’t waste it on this page.",
  "There's a world of possibilities out there. Stop scrolling!",
  "Turn off this screen and go do something meaningful.",
  "You know what to do. Time to make it happen!",
  "Go work towards the life you want. Right now.",
  "Make today count. Log off and get started!",
  "Procrastination won’t get you anywhere. Let’s move!",
  "The future belongs to the doers, not the scrollers. Go do!",
];

const CONSTANTS = {
  AVOID_WEBSITE: "avoid_website",
  SITES_LIST: "sitesList",
  MUTE: "muteTab",
};

const URLS = {
  YOUTUBE_SHORTS: "https://www.youtube.com/shorts/",
  TIKTOK: "https://www.tiktok.com/",
  INSTAGRAM: "https://www.instagram.com/",
  X: "https://x.com/",
};

async function createNotification() {
  await chrome.runtime.sendMessage({ message: CONSTANTS.MUTE });
  document.body.innerHTML = "";
  document.body.outerHTML = "";
  document.head.innerHTML = "";

  const image = document.createElement("img");
  image.src =
    "data:image/png;base64,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";
  image.style.opacity = "0.7";

  const notification = document.createElement("div");
  notification.style.marginTop = "1em";
  notification.style.color = "white";
  notification.style.display = "flex";
  notification.style.justifyContent = "center";
  notification.style.alignItems = "center";
  notification.style.opacity = "0.9";
  notification.style.zIndex = "9999";
  notification.style.fontSize = "26px";
  notification.innerHTML =
    MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

  document.body.style.display = "grid";
  document.body.style.backgroundColor = "black";
  document.body.style.placeContent = "center";
  document.body.style.placeItems = "center";
  document.body.style.height = "100vh";
  document.body.appendChild(image);
  document.body.appendChild(notification);
}

async function runScript() {
  const url = window.location.href;

  /** @type {UrlCheck[]} */
  const items = (await chrome.storage.sync.get([CONSTANTS.SITES_LIST])) || [];
  const sites = items?.sitesList || null;

  const matchedUrl = sites.filter(
    (site) => url.startsWith(site.url) && site.checked === true
  );

  if (matchedUrl.length > 0) {
    createNotification();
  }

  // if (url.startsWith(URLS.YOUTUBE_SHORTS)) {
  //   location.href = "https://www.youtube.com/";
  //   OPEN IN THE SAME TAB
  //   window.open("https://www.google.com", "_self");
  // }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === CONSTANTS.AVOID_WEBSITE) {
    runScript();
  }
});
