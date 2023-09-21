import { generateAutocompleteBadge } from "./badge/badge";
import { generateMatchingItem, matchingItem, matchingTable } from "./matching/matching";
import { generateFloatingInfoTable, removeFloatingInfoTable } from "./badge/badge"

export type matchingItemWithId = {
    addToDB: boolean | undefined,
    item: matchingItem,
    id: string,
    acNeeded: boolean | undefined,
    valCorrect: boolean | undefined,
    actualVal: string | undefined
}

type badgeData = {badgeId: number, matchingTable: matchingTable}

const labeledMatchingItemList: matchingItemWithId[] = [];

const badgeDataList: badgeData[] = [];


const setHighlighting = async () => {

    const currentHighlightStateObj = await chrome.storage.local.get(["acc.highlight"]);
    const currentHighlightState = currentHighlightStateObj["acc.highlight"] as boolean;

    // send message to background script, to update badge text
    const response = await chrome.runtime.sendMessage({ msg: "acc.updateBadgeText" });

    if (currentHighlightState) {

        console.log("add highlights");


        generateFloatingInfoTable();


        //TODO check which shall be retrieved
        const inputElements = document.getElementsByTagName("input");
        const inputElements2 = document.getElementsByTagName("textarea");
        const inputElements3 = document.getElementsByTagName("select");

        const combinedElements = [...inputElements, ...inputElements2, ...inputElements3];


        const onlyTestFormsObj = await chrome.storage.local.get(["acc.onlyTestForms"]);
        const onlyTestFormsState = onlyTestFormsObj["acc.onlyTestForms"] as boolean;


        for (const [i, element] of combinedElements.entries()) {
            // ignore inputs, that were added by the plugin itself
            if (element.className === "acc.devModeInput") {
                continue;
            }

            const parentFormId = getParentFormId(element);

            //TODO shall hidden fields be tested?
            if (element.type !== "hidden" && (onlyTestFormsState ? parentFormId !== undefined : true)) {

                const matchingItem = generateMatchingItem(element, document, parentFormId);

                // do plugin auto classification
                const classificationResult = await chrome.runtime.sendMessage({ msg: "acc.classifyField", data: matchingItem });
                const labeledResults = (classificationResult.data as matchingTable);
                
                const newBadgeId = getNewBadgeId();
                const badgeContainer = await generateAutocompleteBadge(element, labeledResults, matchingItem, labeledMatchingItemList, newBadgeId);



                //show nodes in same line

                //TODO is modifying the parent allowed?
                //element.style.display = "inline-block";

                //badgeContainer.style.position = "absolute";

                element.parentNode?.insertBefore(badgeContainer, element.nextSibling);
            }

        }

    } else {

        console.log("highlight off");

        removeFloatingInfoTable();

        const cssBadges = document.getElementsByClassName("acc-badge");

        console.log(cssBadges);
        console.log(cssBadges.length);

        //delete elements in reverse (cssBadges is a live list!!!)
        for (var i = cssBadges.length - 1; i >= 0; --i) {
            cssBadges[i].remove(); //TODO check browser compatibility
        }

    }



}

const getNewBadgeId = () => {
    if (badgeDataList.length === 0) {
        return 1;
    }
    // get highest id and increment by one
    return badgeDataList.map(d => d.badgeId).sort((a,b) => b - a)[0] + 1;
}

const getParentFormId = (element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) => {
    const forms = document.getElementsByTagName("form");
    for (const form of forms) {
        if (form.contains(element)) {
            return form.id;
        }
    }
    let formVal = element.getAttribute("form");
    if (formVal !== null) {
        return formVal;
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

    const response = await chrome.runtime.sendMessage({ msg: "acc.addFormToDB", data: filteredData, url: window.location.href });
}


chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.msg === "acc.toggleHighlightContent") {

            setHighlighting();

            sendResponse({ status: true });
        }
    }
);


console.log("contentscript injected!");

// set initial highlighting upon opening
setHighlighting();






const devMode = chrome.storage.local.get(["acc.devMode"], items => {
    if (items["acc.devMode"]) {
        const overlayButton = document.createElement("button");
        overlayButton.innerHTML = "Add to DB";
        overlayButton.style.position = "absolute";
        overlayButton.style.top = "12px";
        overlayButton.style.padding = "8px";
        overlayButton.style.zIndex = "9999";
        overlayButton.onclick = addCurrentFormToDB;
        document.body.appendChild(overlayButton);
    }
});

