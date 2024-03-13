chrome.action.onClicked.addListener( (tab) =>  {
  
    let message = { text : "autocraft" }
    chrome.tabs.sendMessage(tab.id, message)

})