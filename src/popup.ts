// set the checkbox state when the popup is opened
const highlightCheckbox = document.getElementById("chk.setHighlight") as HTMLInputElement | null;
const highlightStateObj = chrome.storage.local.get(["acc.highlight"], items => {
    const highlightState = items["acc.highlight"] as boolean;
    if (highlightCheckbox !== null) {
        highlightCheckbox.checked = highlightState;
    }
});



const checkForContentScript = async (tabId: number) => {
    return new Promise((resolve) => {
        chrome.tabs.sendMessage(tabId, { msg: "acc.isContentScript" }, (result) => {
            if (result === undefined) {
                resolve(false);
            } else {
                resolve(result.status)
            }
        });
    })
}




const setHighlight = async (e: Event) => {
    // get state of checkbox from change-event
    const checkboxState = (e.target as HTMLInputElement).checked;

    // save new state in storage
    await chrome.storage.local.set({ "acc.highlight": checkboxState })

    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

    if (tab.id === undefined) return;
    
    const response = await chrome.tabs.sendMessage(tab.id, { msg: "acc.toggleHighlightContent" });

}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("chk.setHighlight")?.addEventListener("change", e => setHighlight(e));
});


