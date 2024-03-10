

const autoCraftButton = document.getElementById('auto-craft-button');

const selectors = {
    createButton : ".Crafting_craftingButton__Qd6Ke"
}

document.addEventListener("click", function(e) {
    if (e.target && e.target.id === "auto-craft-button") {
        toggleAutoCraft();
    }
});

function toggleAutoCraft() {
    const autoCraftButton = document.getElementById('auto-craft-button');
    if (autoCraftButton.textContent === "Auto-Craft") {
        autoCraftButton.textContent = "Stop Auto-Craft";
        autoCraftButton.classList.add("button-active");
      
       
        console.log("Auto-Crafting...");
    } else {
        autoCraftButton.textContent = "Auto-Craft";
        autoCraftButton.classList.remove("button-active");
        console.log("Auto-Crafting Stopped");
    }
}


