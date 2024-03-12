const autoCraftButton = document.getElementById('auto-craft-button');

// AUTO CRAFT BUTTON
autoCraftButton.addEventListener("click", () => {
    const messages = {
        startAutoCraft : "start-autocraft",
        stopAutoCraft : "stop-autocraft"
    }
    const { startAutoCraft, stopAutoCraft  } = messages;
    
    const autoCraftButton = document.getElementById('auto-craft-button');

    if (autoCraftButton.textContent === "Auto-Craft") {
        autoCraftButton.textContent = "Stop Auto-Craft";
        autoCraftButton.classList.add("button-active");
        
        chrome.tabs.query({ active : true } , (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, startAutoCraft)
        }) 
        
        console.log("Auto-Crafting Started");
    } else {
        autoCraftButton.textContent = "Auto-Craft";
        autoCraftButton.classList.remove("button-active");
        
        chrome.tabs.query({ active : true } , (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, stopAutoCraft)
        }) 

        console.log("Auto-Crafting Stopped");
    }    
});




