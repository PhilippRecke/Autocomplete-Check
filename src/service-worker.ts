import { matchingItemWithId } from "./content-script";
import { dbSiteItem, dbSiteItemNoForms } from "./db/dbtypes";
import { analyzeField, matchingItem } from "./matching/matching";

chrome.runtime.onInstalled.addListener(async () => {
    /*
    // sets tetx as a badge on the toolbar icon of the extension
    chrome.action.setBadgeText({
        text: "OFF",
    });
    */

    // Set the action badge to the default state (off)
    await chrome.action.setIcon({
        path: "icon32-d.png"
    });

    // set initial values upon install
    await chrome.storage.local.set({ "acc.highlight": false });
    await chrome.storage.local.set({ "acc.showHidden": true });
    await chrome.storage.local.set({ "acc.showDisabled": true });
    await chrome.storage.local.set({ "acc.hoverColor": "#303030" });
    await chrome.storage.local.set({ "acc.fontSize": "small" });
    await chrome.storage.local.set({ "acc.onlyTestForms": false });
    await chrome.storage.local.set({ "acc.floatBadge": false });
    await chrome.storage.local.set({ "acc.classThreshold": "0.5" });
    await chrome.storage.local.set({ "acc.devMode": false });
    await chrome.storage.local.set({ "acc.dbUrlTxt": "" });
    await chrome.storage.local.set({ "acc.dbUsrTxt": "" });
    await chrome.storage.local.set({ "acc.dbPwdTxt": "" });
});

const updateBadgeText = async (sendResponse: (response: any) => void) => {
    const currentHighlightStateObj = await chrome.storage.local.get(["acc.highlight"]);
    const currentHighlightState = currentHighlightStateObj["acc.highlight"] as boolean;
    
    chrome.action.setBadgeText({
        text: currentHighlightState ? "ON" : "OFF",
    });

    sendResponse({status: true});
}

const updateBadgeState = async (tab: chrome.tabs.Tab) => {

    const currentHighlightStateObj = await chrome.storage.local.get(["acc.highlight"]);
    const currentHighlightState = currentHighlightStateObj["acc.highlight"] as boolean;

    
    await chrome.storage.local.set({ "acc.highlight": !currentHighlightState });


    /*
    chrome.action.setBadgeText({
        text: currentHighlightState ? "ON" : "OFF",
    });
    */

    // Set the action badge to the next state
    await chrome.action.setIcon({
        path: !currentHighlightState ? "icon32-g.png" : "icon32-d.png"
    });

    if (tab.id === undefined) return;
    console.log(`tab-id: ${tab.id}`);
    
    const response = await chrome.tabs.sendMessage(tab.id, { msg: "acc.toggleHighlightContent" });
    //TODO Error when receiving end does not exist (anymore)

    return true;
}

// handle incoming messages
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.msg) {
        case "acc.updateBadgeText":
            updateBadgeText(sendResponse);
            break;

        case "acc.addFormToDB":
            sendToDB(request.data, sendResponse);
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


const sendToDB = async (itemList: dbSiteItemNoForms | dbSiteItem, sendResponse: (response: any) => void) => {

    const dbUrlTxtObj = await chrome.storage.local.get("acc.dbUrlTxt");
    const dbUrl = dbUrlTxtObj["acc.dbUrlTxt"] as string;

    const dbUsrTxtObj = await chrome.storage.local.get("acc.dbUsrTxt");
    const dbUsr = dbUsrTxtObj["acc.dbUsrTxt"] as string;

    const dbPwdTxtObj = await chrome.storage.local.get("acc.dbPwdTxt");
    const dbPwd = dbPwdTxtObj["acc.dbPwdTxt"] as string;

    const res = await fetch(`${dbUrl}/autocompletecheck-db/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + btoa(`${dbUsr}:${dbPwd}`),
            },
            body: JSON.stringify(itemList)
        }
    );
    
    console.log(res.statusText);
    console.log(res);

    sendResponse({status: res.statusText});
}


chrome.action.onClicked.addListener(async (tab) => {
    
    updateBadgeState(tab);

});


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