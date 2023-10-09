import { generateAutocompleteBadge } from "./badge/badge";
import { generateMatchingItem, matchingItem, matchingTable } from "./matching/matching";
import { generateFloatingInfoTable, removeFloatingInfoTable } from "./badge/badge"
import { dbSiteItemNoForms } from "./db/dbtypes";

export type matchingItemWithId = {
    addToDB: boolean | undefined,
    item: matchingItem,
    id: string,
    acNeeded: boolean | undefined,
    valCorrect: boolean | undefined,
    actualVal: string | undefined
}

type badgeData = {badgeId: string, matchingTable: matchingTable, oldAriaDescBy: string | null}

const labeledMatchingItemList: matchingItemWithId[] = [];


const setHighlighting = async () => {

    // TODO listener when website has finished loading. when plugin activated, and view other tab, highlight might not be activated

    const currentHighlightStateObj = await chrome.storage.local.get(["acc.highlight"]);
    const currentHighlightState = currentHighlightStateObj["acc.highlight"] as boolean;

    // send message to background script, to update badge text
    // const response = await chrome.runtime.sendMessage({ msg: "acc.updateBadgeText" });

    //TODO check which shall be retrieved
    const inputElements = document.getElementsByTagName("input");
    const inputElements2 = document.getElementsByTagName("textarea");
    const inputElements3 = document.getElementsByTagName("select");

    const combinedElements = [...inputElements, ...inputElements2, ...inputElements3];

    if (currentHighlightState) {

        console.log("acc-extension: add highlights");

        generateFloatingInfoTable();

        addDbSendButton();

        // clear old badge data
        await chrome.storage.local.set({ "acc.badgeDataList": [] });

        // get user settings
        const onlyTestFormsObj = await chrome.storage.local.get(["acc.onlyTestForms"]);
        const onlyTestFormsState = onlyTestFormsObj["acc.onlyTestForms"] as boolean;

        const showHiddenObj = await chrome.storage.local.get(["acc.showHidden"]);
        const showHiddenState = showHiddenObj["acc.showHidden"] as boolean;

        const showDisabledObj = await chrome.storage.local.get(["acc.showDisabled"]);
        const showDisabledState = showDisabledObj["acc.showDisabled"] as boolean;

        for (const [i, element] of combinedElements.entries()) {
            // ignore inputs, that were added by the plugin itself
            if (element.className === "acc.devModeInput") {
                continue;
            }

            if (!showHiddenState && element.type === "hidden") {
                continue;
            }

            if (!showDisabledState && element.disabled === true) {
                continue;
            }

            const parentFormIdAndName = getParentFormIdAndName(element);
            if (onlyTestFormsState && parentFormIdAndName !== undefined) {
                continue;
            }


            // analyze item
            const matchingItem = generateMatchingItem(element, document, i, parentFormIdAndName?.id, -1);

            // do plugin auto classification
            const classificationResult = await chrome.runtime.sendMessage({ msg: "acc.classifyField", data: matchingItem });
            const labeledResults = (classificationResult.data as matchingTable);
            
            const newBadgeId = await getNewBadgeId();
            const badgeContainer = await generateAutocompleteBadge(element, labeledResults, matchingItem, labeledMatchingItemList, newBadgeId);

            // make badge hovering or inline, depending on settings
            const floatBadgeObj = await chrome.storage.local.get(["acc.floatBadge"]);
            const floatBadgeState = floatBadgeObj["acc.floatBadge"] as boolean;
            if (floatBadgeState) {
                badgeContainer.classList.add("float");
                const boundingRect = element.getBoundingClientRect();
                badgeContainer.style.left = `${boundingRect.left + window.scrollX}px`;
                badgeContainer.style.top = `${boundingRect.bottom + window.scrollY}px`;
                document.body.appendChild(badgeContainer);
            } else {
                badgeContainer.classList.add("inline");
                element.parentNode?.insertBefore(badgeContainer, element.nextSibling);
            }

            // save in badgeData
            const badgeDataListObj = await chrome.storage.local.get(["acc.badgeDataList"]);
            const badgeDataList = badgeDataListObj["acc.badgeDataList"] as badgeData[];
            const newBadgeDataEntry: badgeData = {badgeId: newBadgeId, matchingTable: labeledResults, oldAriaDescBy: element.getAttribute("aria-describedby")};
            

            badgeDataList.push(newBadgeDataEntry);
            await chrome.storage.local.set({ "acc.badgeDataList": badgeDataList });

            // add aria described by
            element.setAttribute("aria-describedby", newBadgeId);

        }

    } else {

        console.log("acc-extension: highlights off");

        removeFloatingInfoTable();

        const cssBadges = document.getElementsByClassName("acc-badge");

        //delete elements in reverse (cssBadges is a live list!!!)
        for (var i = cssBadges.length - 1; i >= 0; --i) {
            cssBadges[i].remove(); //TODO check browser compatibility
        }

        removeDbSendButton();

        // remove aria-describedby, or set original value
        const badgeDataListObj = await chrome.storage.local.get(["acc.badgeDataList"]);
        const badgeDataList = badgeDataListObj["acc.badgeDataList"] as badgeData[];
        for (const element of combinedElements) {
            if (element.getAttribute("aria-describedby")?.includes("acc-badgeNo")) {
                const matchingBadgeData = badgeDataList.find(item => item.badgeId === element.getAttribute("aria-describedby"));
                if (matchingBadgeData !== undefined) {
                    if (matchingBadgeData.oldAriaDescBy !== null) {
                        element.setAttribute("aria-describedby", matchingBadgeData.oldAriaDescBy);
                    } else {
                        element.removeAttribute("aria-describedby");
                    }
                } else {
                    element.removeAttribute("aria-describedby");
                }
            }
        }

    }



}

const getNewBadgeId = async () => {
    const badgeDataListObj = await chrome.storage.local.get(["acc.badgeDataList"]);
    const badgeDataList = badgeDataListObj["acc.badgeDataList"] as badgeData[];

    if (badgeDataList.length === 0) {
        return `acc-badgeNo${1}`;
    }
    // get highest id and increment by one
    const newIdCounter = badgeDataList.map(d => Number(d.badgeId.replace("acc-badgeNo", ""))).sort((a, b) => b - a)[0] + 1;
    return `acc-badgeNo${newIdCounter}`;
}

const getParentFormIdAndName = (element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) => {
    const forms = document.getElementsByTagName("form");
    for (const form of forms) {
        if (form.contains(element)) {
            return {id: form.id, name: form.name};
        }
    }
    let formVal = element.getAttribute("form");
    if (formVal !== null) {
        const form = document.getElementById(formVal) as HTMLFormElement;
        if (form !== null) {
            return {id: form.id, name: form.name};
        }
    }
    return undefined;
}

const addCurrentFormToDB = async () => {
    const filteredData = labeledMatchingItemList.filter(i => i.addToDB);

    for (const item of filteredData) {
        if (item.acNeeded === undefined) {
            item.acNeeded = false;
        } 
        if (item.valCorrect === undefined) {
            item.acNeeded = false;
        } 
    }

    const hydratedData = filteredData.map(d => {
        const dbFieldItem = d.item;
        dbFieldItem.correctAutocomplete = d.valCorrect ? d.item.autocomplete : (d.actualVal ? d.actualVal : null);
        if (!d.acNeeded) {
            d.item.autocomplete = null;
        } 
        return dbFieldItem
    });

    // TODO swap with version that supports forms
    const dbItemNoForms: dbSiteItemNoForms = {
        dataVersion: 1,
        url: window.location.href,
        date: new Date().toJSON(),  // 1975-08-19T23:15:30.000Z
        hostname: window.location.hostname,  // e.g. hdm-stuttgart.de
        htmlLanguage: document.documentElement.lang,
        htmlTitle: document.title,
        dom: document.documentElement.outerHTML,
        fields: hydratedData,
        numOfLabeledFields: hydratedData.length
    }

    const response = await chrome.runtime.sendMessage({ msg: "acc.addFormToDB", data: dbItemNoForms });
    
    console.log(`acc-extension: ${response}`);

    switch (response.status) {
        case "Created":
            alert("Added new database Entry.");
            break;
        case "Unauthorized":
            alert("Error: Unauthorized!");
            break;
        
    }
}


chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.msg === "acc.toggleHighlightContent") {

            setHighlighting();

            sendResponse({ status: true });
        }
    }
);


console.log("acc-extension: started");

// set initial highlighting upon opening
setHighlighting();



const addDbSendButton = () => {
    chrome.storage.local.get(["acc.devMode"], items => {
        if (items["acc.devMode"]) {
            const overlayButton = document.createElement("button");
            overlayButton.id = "acc-dbSendButton";
            overlayButton.innerHTML = "Add to DB";
            overlayButton.style.position = "absolute";
            overlayButton.style.top = "12px";
            overlayButton.style.padding = "8px";
            overlayButton.style.zIndex = "9999";
            overlayButton.onclick = addCurrentFormToDB;
            document.body.appendChild(overlayButton);
        }
    });
}

const removeDbSendButton = () => {
    const btn = document.getElementById("acc-dbSendButton");
    if (btn === null) {
        return;
    }
    btn.remove();
}


