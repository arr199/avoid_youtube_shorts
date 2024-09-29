const CONSTANTS = {
  AVOID_SHORTS: "avoid_shorts",
};

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    let message = CONSTANTS.AVOID_SHORTS;
    chrome.tabs.sendMessage(tab.id, message);
  }
});


