const CONSTANTS = {
  AVOID_WEBSITE: "avoid_website",
  MUTE: "muteTab",
};

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    let message = CONSTANTS.AVOID_WEBSITE;
    chrome.tabs.sendMessage(tab.id, message);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === CONSTANTS.MUTE) {
    chrome.tabs.update(sender.tab.id, { muted: true });
  }
});
