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


const toggleHighlight = async () => {

    const oldHighlightState = await chrome.storage.local.get(["acc.highlight"]);

    await chrome.storage.local.set({ "acc.highlight": !oldHighlightState["acc.highlight"] })

    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

    if (tab.id === undefined) return;
    
    const response = await chrome.tabs.sendMessage(tab.id, { msg: "acc.toggleHighlightContent" });

}


document.addEventListener("DOMContentLoaded", () => {
    //document.getElementById("btn.toggleHighlight").addEventListener("click", toggleHighlight);
    document.getElementById("chk.toggleHighlight")?.addEventListener("change", toggleHighlight);
});


