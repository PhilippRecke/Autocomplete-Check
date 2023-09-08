import { generateMatchingItem, matchingItem, matchingTable } from "./matching/matching";
import autocompleteDict from './matching/autocomplete-values.json';

export type matchingItemWithId = {
    addToDB: boolean | undefined,
    item: matchingItem,
    id: string,
    acNeeded: boolean | undefined,
    valCorrect: boolean | undefined,
    actualVal: string | undefined
}

const labeledMatchingItemList: matchingItemWithId[] = [];


const setHighlighting = async () => {

    const currentHighlightStateObj = await chrome.storage.local.get(["acc.highlight"]);
    const currentHighlightState = currentHighlightStateObj["acc.highlight"] as boolean;

    // send message to background script, to update badge text
    const response = await chrome.runtime.sendMessage({ msg: "acc.updateBadgeText" });

    if (currentHighlightState) {

        console.log("add highlights");

        //TODO check which shall be retrieved
        const inputElements = document.getElementsByTagName("input");
        const inputElements2 = document.getElementsByTagName("textarea");
        const inputElements3 = document.getElementsByTagName("select");

        const combinedElements = [...inputElements, ...inputElements2, ...inputElements3];

        console.log(combinedElements);

        for (const element of combinedElements) {
            // ignore inputs, that were added by the plugin itself
            if (element.className === "acc.devModeInput") {
                continue;
            }

            //TODO shall hidden fields be tested?
            if (element.type !== "hidden") {

                const matchingItem = generateMatchingItem(element, document);

                // do plugin auto classification
                const classificationResult = await chrome.runtime.sendMessage({ msg: "acc.classifyField", data: matchingItem });
                const labeledResults = (classificationResult.data as matchingTable);
                


                const autocompleteOK = element.autocomplete !== undefined && element.autocomplete !== "";

                const autocompleteVal = autocompleteOK ? element.autocomplete : "value missing";


                const badgeContainer = document.createElement("div");
                badgeContainer.className = "acc-badge"

                const badgeIcon = document.createElement("div");

                console.log(element.autocomplete === "");

                badgeIcon.className = autocompleteOK ? "acc-icon acc-correct" : "acc-icon acc-false";
                badgeIcon.innerHTML = autocompleteOK ? "✔" : "❌";

                const badgeText = document.createElement("div");
                badgeText.className = autocompleteOK ? "acc-text acc-correct" : "acc-text acc-false";
                badgeText.innerHTML = `autocomplete: ${autocompleteVal}`;

                badgeContainer.appendChild(badgeIcon);
                badgeContainer.appendChild(badgeText);


                let autoLabelText;
                if (labeledResults[0].acValue === autocompleteVal) {
                    autoLabelText = `${labeledResults[0].confidenceScore.toFixed(1)}`;
                } else {
                    autoLabelText = `${labeledResults[0].acValue}: ${labeledResults[0].confidenceScore.toFixed(1)}`
                }

                const badgeClassificationLabel = document.createElement("div");
                badgeClassificationLabel.className = "acc-classificationLabel";
                badgeClassificationLabel.innerHTML = autoLabelText;

                badgeContainer.appendChild(badgeClassificationLabel);


                // only for devMode (db)
                const devModeObj = await chrome.storage.local.get(["acc.devMode"]);
                const devMode = devModeObj["acc.devMode"] as boolean;

                if (devMode) {
                    const addToDBText = document.createElement("p");
                    addToDBText.innerHTML = "add todb:";
                    addToDBText.className = "acc.devModeText";
                    addToDBText.style.padding = "4px";

                    const addToDB = document.createElement("input");
                    addToDB.type = "checkbox";
                    addToDB.className = "acc.devModeInput"
                    addToDB.style.padding = "4px";
                    addToDB.onchange = (e) => {
                        const item = labeledMatchingItemList.find(item => item.id === element.id);
                        if (item === undefined) {
                            const tmpItem: matchingItemWithId = {
                                id: element.id,
                                item: matchingItem,
                                addToDB: (e.target as HTMLInputElement).checked,
                                acNeeded: undefined,
                                valCorrect: undefined,
                                actualVal: undefined
                            }
                            labeledMatchingItemList.push(tmpItem);
                        } else {
                            item.addToDB = (e.target as HTMLInputElement).checked
                        }
                    }

                    const acNeededText = document.createElement("p");
                    acNeededText.innerHTML = "ac needed:";
                    acNeededText.className = "acc.devModeText";
                    acNeededText.style.padding = "4px";

                    const acNeeded = document.createElement("input");
                    acNeeded.type = "checkbox";
                    acNeeded.className = "acc.devModeInput"
                    acNeeded.style.padding = "4px";
                    acNeeded.onchange = (e) => {
                        const item = labeledMatchingItemList.find(item => item.id === element.id);
                        if (item === undefined) {
                            const tmpItem: matchingItemWithId = {
                                id: element.id,
                                item: matchingItem,
                                addToDB: undefined,
                                acNeeded: (e.target as HTMLInputElement).checked,
                                valCorrect: undefined,
                                actualVal: undefined
                            }
                            labeledMatchingItemList.push(tmpItem);
                        } else {
                            item.acNeeded = (e.target as HTMLInputElement).checked
                        }
                    }

                    const valueCorrectText = document.createElement("p");
                    valueCorrectText.innerHTML = "value correct:";
                    valueCorrectText.className = "acc.devModeText";
                    valueCorrectText.style.padding = "4px";

                    const valueCorrect = document.createElement("input");
                    valueCorrect.type = "checkbox";
                    valueCorrect.className = "acc.devModeInput"
                    valueCorrect.style.padding = "4px";
                    valueCorrect.onchange = (e) => {
                        const item = labeledMatchingItemList.find(item => item.id === element.id);
                        if (item === undefined) {
                            const tmpItem: matchingItemWithId = {
                                id: element.id,
                                item: matchingItem,
                                addToDB: undefined,
                                acNeeded: undefined,
                                valCorrect: (e.target as HTMLInputElement).checked,
                                actualVal: undefined
                            }
                            labeledMatchingItemList.push(tmpItem);
                        } else {
                            item.valCorrect = (e.target as HTMLInputElement).checked
                        }
                    }

                    const actualValue = document.createElement("select");
                    actualValue.className = "acc.devModeInput"
                    for (const val of autocompleteDict.values) {
                        const option = document.createElement("option");
                        option.value = val;
                        option.text = val;
                        actualValue.appendChild(option);
                    }
                    actualValue.onchange = (e) => {
                        const item = labeledMatchingItemList.find(item => item.id === element.id);
                        if (item === undefined) {
                            const tmpItem: matchingItemWithId = {
                                id: element.id,
                                item: matchingItem,
                                addToDB: undefined,
                                acNeeded: undefined,
                                valCorrect: undefined,
                                actualVal: (e.target as HTMLInputElement).value
                            }
                            labeledMatchingItemList.push(tmpItem);
                        } else {
                            item.actualVal = (e.target as HTMLInputElement).value
                        }
                    }

                    badgeContainer.appendChild(addToDBText);
                    badgeContainer.appendChild(addToDB);
                    badgeContainer.appendChild(acNeededText);
                    badgeContainer.appendChild(acNeeded);
                    badgeContainer.appendChild(valueCorrectText);
                    badgeContainer.appendChild(valueCorrect);
                    badgeContainer.appendChild(actualValue);

                }




                //show nodes in same line

                //TODO is modifying the parent allowed?
                //element.style.display = "inline-block";

                //badgeContainer.style.position = "absolute";

                element.parentNode?.insertBefore(badgeContainer, element.nextSibling);
            }

        }

    } else {

        console.log("highlight off");

        const cssBadges = document.getElementsByClassName("acc-badge");

        console.log(cssBadges);
        console.log(cssBadges.length);

        //delete elements in reverse (cssBadges is a live list!!!)
        for (var i = cssBadges.length - 1; i >= 0; --i) {
            cssBadges[i].remove(); //TODO check browser compatibility
        }

    }



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

