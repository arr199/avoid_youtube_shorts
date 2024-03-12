let craftInterval;

function autoCraft() {
    const pageElementSelectors = {
        createButton : ".Crafting_craftingButton__Qd6Ke"
    }

    const pixelCreateButton = document.querySelector(pageElementSelectors.createButton);
    if (pixelCreateButton && !pixelCreateButton.disabled) {
        console.log("CREATE BUTTON DETECTED !!!")
         craftInterval = setInterval(() => {
            if (!pixelCreateButton.disabled || pixelCreateButton.textContent === "In Progress") {
                console.log(pixelCreateButton.textContent)
                pixelCreateButton.click();
            } else {
                console.log(pixelCreateButton.textContent)
                console.log("CREATE BUTTON DISABLED !!!")
                clearInterval(craftInterval);
            }
        }, 1000);
    } else {
        console.log("NO BUTTON DETECTED !!!")
        return;
    }
}


chrome.runtime.onMessage.addListener( (  message , sender , sendResponse ) => {
    if (message === "start-autocraft") {
        console.log("autocrafting started")
         autoCraft() 
    }
    if (message === "stop-autocraft") {
        clearInterval(craftInterval);
        console.log("autocrafting stopped")
    }
   
})



