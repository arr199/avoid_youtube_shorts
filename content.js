function autoCraft() {
    const selectors = {
        createButton: ".Crafting_craftingButton__Qd6Ke"
    };

    const pixelCreateButton = document.querySelector(selectors.createButton);
    if (pixelCreateButton && !pixelCreateButton.disabled) {
        console.log("CREATE BUTTON DETECTED !!!")
        const intervalId = setInterval(() => {
            if (!pixelCreateButton.disabled || pixelCreateButton.textContent === "In Progress") {
                console.log(pixelCreateButton.textContent);
                pixelCreateButton.click();
            } else {
                console.log(pixelCreateButton.textContent)
                console.log("CREATE BUTTON DISABLED !!!")
                clearInterval(intervalId);
            }
        }, 1000);
    } else {
        console.log("NO BUTTON DETECTED !!!")
        return;
    }
}

chrome.runtime.onMessage.addListener( (  message , sender , sendResponse ) => {
    if (message.text === "autocraft") {
        console.log("autocrafting")
         autoCraft() 
    }
    console.log("autocrafting")
   
})



