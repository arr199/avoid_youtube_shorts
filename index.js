const CONSTANTS = {
  AVOID_SHORTS: "avoid_shorts",
};

const sendMessageToContentScript = (message) => {
  console.log("SENDING MESSAGE");
  chrome.tabs.query({ active: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
};

// AUTO CRAFT BUTTON
window.addEventListener("click", () => {
  console.log("DOCUMENT LOADED");
  sendMessageToContentScript(CONSTANTS.AVOID_SHORTS);
});
