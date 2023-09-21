import { matchingItemWithId } from "./content-script";
import { analyzeField, matchingItem } from "./matching/matching";

chrome.runtime.onInstalled.addListener(async () => {
    // sets tetx as a badge on the toolbar icon of the extension
    chrome.action.setBadgeText({
        text: "OFF",
    });

    // set initial values upon install
    await chrome.storage.local.set({ "acc.highlight": false });
    await chrome.storage.local.set({ "acc.showHidden": true });
    await chrome.storage.local.set({ "acc.devMode": false });
});

const updateBadgeText = async () => {
    const currentHighlightStateObj = await chrome.storage.local.get(["acc.highlight"]);
    const currentHighlightState = currentHighlightStateObj["acc.highlight"] as boolean;

    chrome.action.setBadgeText({
        text: currentHighlightState ? "ON" : "OFF",
    });

    return true;
}

// handle incoming messages
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    switch (request.msg) {
        case "acc.updateBadgeText":
            sendResponse({ status: updateBadgeText() });
            break;

        case "acc.addFormToDB":
            sendResponse({ status: sendToDB(request.url, request.data) });
            break;

        case "acc.classifyField":
            sendResponse({ data: classifyField(request.data) });
            break;

        default:
            break;

    }

    return true;
});


const classifyField = (data: matchingItem) => {
    const classifyTable = analyzeField(data);
    return classifyTable;
}


const sendToDB = async (url: string, itemList: matchingItemWithId[]) => {

    //axios.post("https://admin:password@192.168.178.100:5987/formfieldcheck-db/", {"url": url, "inputs": itemList});

    //const res = await fetch(url, { method: "POST", credentials: "include", headers: { Cookie: token }, });

    console.log("begin ");
    
    
    const res = await fetch("http://192.168.178.100:5987/formfieldcheck-db/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + btoa("admin:password"),
            },
            body: JSON.stringify({ "url": url, "inputs": itemList })
        }
    );

    console.log(res.statusText);
    console.log(res);
    

    return true;
}



/*
chrome.action.onClicked.addListener(async (tab) => {

    

    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON';

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
        tabId: tab.id,
        text: nextState
    });

    if (nextState === 'ON') {
        // Insert the CSS file when the user turns the extension on
        await chrome.scripting.insertCSS({
            files: ['focus-mode.css'],
            target: { tabId: tab.id }
        });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content-script.js"]
        });

    } else if (nextState === 'OFF') {
        // Remove the CSS file when the user turns the extension off
        await chrome.scripting.removeCSS({
            files: ['focus-mode.css'],
            target: { tabId: tab.id }
        });
    }

    

});



(async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { highlight: true });
    // do something with response here, not outside the function
    console.log(response);
})();


chrome.runtime.onMessage.addListener(
    (request, sender) => {
        request.highlight ? "a" : "b";
    }
);




chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.msg === "acc.toggleHighlightWorker") {
            
            console.log("toggle Worker received");


            const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

            await chrome.tabs.sendMessage(tab.id, { msg: "acc.toggleHighlightContent" });

            sendResponse({status: true});
        }

        return true;
    }
);

*/