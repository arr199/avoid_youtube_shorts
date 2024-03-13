const autoCraftButton = document.getElementById('auto-craft-button');

const sendMessageToContentScript = (message) => {
    chrome.tabs.query({ active : true } , (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, message)
    })
} 

const messages = {
    startAutoCraft : "start-autocraft",
    stopAutoCraft : "stop-autocraft"
}

// AUTO CRAFT BUTTON
autoCraftButton.addEventListener("click", () => {
    const { startAutoCraft, stopAutoCraft  } = messages;
    const autoCraftButton = document.getElementById('auto-craft-button');

    if (autoCraftButton.textContent === "Auto-Craft") {
        autoCraftButton.textContent = "Stop Auto-Craft";
        autoCraftButton.classList.add("button-active");
        
        sendMessageToContentScript(startAutoCraft);
        console.log("Auto-Crafting Started");
    } else {
        autoCraftButton.textContent = "Auto-Craft";
        autoCraftButton.classList.remove("button-active");

        sendMessageToContentScript(stopAutoCraft);
        console.log("Auto-Crafting Stopped");
    }    
});