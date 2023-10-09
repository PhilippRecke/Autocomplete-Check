import { matchingItemWithId } from "../content-script";
import { matchingTable, matchingItem, matchingTableEntry } from "../matching/matching";
import autocompleteDict from '../matching/autocomplete-values.json';

type acStatus = "✔ AC OK" | "✔ NO AC NEEDED" | "❕ AC WRONG" | "❕ AC FOUND" | "❕ NO AC FOUND" | "❌ AC WRONG";

export const generateAutocompleteBadge = async (
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
    labeledResults: matchingTable,
    matchingItem: matchingItem,
    labeledMatchingItemList: matchingItemWithId[], // for db labeling
    badgeId: string
    ) => {

    const autocompleteFound = element.hasAttribute("autocomplete");
    let autocompleteVal = element.getAttribute("autocomplete");
    if (autocompleteVal === null) {
        autocompleteVal = "value missing";
    }
    
    const autocompleteIsValidValue = autocompleteDict.values.includes(autocompleteVal);

    const badgeContainer = document.createElement("div");
    badgeContainer.className = "acc-badge"
    badgeContainer.id = badgeId;

    // add element id as data attribute
    if (element.id !== undefined && element.id !== "") {
        badgeContainer.setAttribute("data-id-of-input", element.id)
    }

    // set font size from settings
    const fontSizeObj = await chrome.storage.local.get("acc.fontSize");
    const fontSize = fontSizeObj["acc.fontSize"] as string;
    badgeContainer.style.fontSize = fontSize;
    
    // do highlighthover, if set in settings
    const hoverColorObj = await chrome.storage.local.get("acc.hoverColor");
    const hoverColor = hoverColorObj["acc.hoverColor"] as string;
    const highlightHoverObj = await chrome.storage.local.get("acc.highlightHover")
    if (highlightHoverObj["acc.highlightHover"] as boolean) {
        badgeContainer.addEventListener('mouseover',  () => {
            badgeContainer.classList.add("acc-tmp-hover");
            element.style.boxShadow = `0 0 12px ${hoverColor}80`; // 80 is 50% alpha, hoverColor is RGB
            
        });
        badgeContainer.addEventListener('mouseout', () => {
            badgeContainer.classList.remove("acc-tmp-hover")
            element.style.boxShadow = "";
        });
    }

    const acThresholdObj = await chrome.storage.local.get("acc.classThreshold");
    const acThresholdStr = acThresholdObj["acc.classThreshold"] as string;
    const acThreshold = Number(acThresholdStr);

    generatePredictionLabel(badgeContainer, labeledResults[0], autocompleteVal, acThreshold, autocompleteFound);

    let warningFlag = false;

    // add label warning
    console.log(matchingItem.label);
    if (matchingItem.label === null || matchingItem.label === "") {
        generateLabelWarning(badgeContainer);
        warningFlag = true;
    }

    // add hidden warning
    if (matchingItem.inputType === "hidden") {
        generateHiddenWarning(badgeContainer);
        warningFlag = true;
    }


    const badgeIcon = document.createElement("div");
    const badgeText = document.createElement("div");

    console.log(`getting acstatus: ${matchingItem.id}`);
    console.log(`acval: ${autocompleteVal}`);
    console.log(`acfound: ${autocompleteFound}`);
    console.log(`warningFlag: ${warningFlag}`);
    
    const autocompleteStatus = getAcStatus(autocompleteFound, autocompleteIsValidValue, autocompleteVal, labeledResults[0], acThreshold, warningFlag);

    switch (autocompleteStatus) {
        case "✔ AC OK":
            badgeIcon.innerHTML = "✔";
            badgeText.innerHTML = `autocomplete: ${autocompleteVal}`;
            badgeIcon.className = "acc-icon acc-correct";
            badgeText.className = "acc-text acc-correct";
            break;
        case "✔ NO AC NEEDED":
            badgeIcon.innerHTML = "✔";
            badgeText.innerHTML = "No autocomplete needed";
            badgeIcon.className = "acc-icon acc-correct";
            badgeText.className = "acc-text acc-correct";
            break;
        case "❕ AC WRONG":
            badgeIcon.innerHTML = "❕";
            badgeText.innerHTML = `autocomplete: ${autocompleteVal}`;
            badgeIcon.className = "acc-icon acc-info";
            badgeText.className = "acc-text acc-info";
            break;
        case "❕ AC FOUND":
            badgeIcon.innerHTML = "❕";
            badgeText.innerHTML = `autocomplete: ${autocompleteVal}`;
            badgeIcon.className = "acc-icon acc-info";
            badgeText.className = "acc-text acc-info";
            break;
        case "❕ NO AC FOUND":
            badgeIcon.innerHTML = "❕";
            badgeText.innerHTML = "No autocomplete needed";
            badgeIcon.className = "acc-icon acc-info";
            badgeText.className = "acc-text acc-info";
            break;
        case "❌ AC WRONG":
            badgeIcon.innerHTML = "❌";
            badgeText.innerHTML = `autocomplete: ${autocompleteVal}`;
            badgeIcon.className = "acc-icon acc-false";
            badgeText.className = "acc-text acc-false";
            break;
    }

    // insert icon and text at top position
    // necesary, because they are dependent on the warning-flag
    badgeContainer.insertBefore(badgeText, badgeContainer.firstChild);
    badgeContainer.insertBefore(badgeIcon, badgeContainer.firstChild);

    
    generateInfoButton(badgeContainer, labeledResults);

    // only for devMode (db)
    const devModeObj = await chrome.storage.local.get(["acc.devMode"]);
    const devMode = devModeObj["acc.devMode"] as boolean;

    if (devMode) {
        const devDiv = generateDevModeUI(element, labeledMatchingItemList, matchingItem);
        badgeContainer.appendChild(devDiv);
    }

    return badgeContainer;

}

const generatePredictionLabel = (parent: HTMLDivElement, prediction: matchingTableEntry, acVal: string, acThreshold: number, acFound: boolean) => {
    let autoLabelText;
    if (prediction.acValue === acVal) {
        autoLabelText = `${prediction.confidenceScore.toFixed(1)}`;
    } else if (prediction.confidenceScore <= acThreshold && !acFound) {
        autoLabelText = `${(1 - prediction.confidenceScore).toFixed(1)}`;
    } else {
        autoLabelText = `${prediction.acValue}: ${prediction.confidenceScore.toFixed(1)}`
    }

    const badgeClassificationLabel = document.createElement("div");
    badgeClassificationLabel.classList.add("acc-classificationLabel", "acc-text");
    badgeClassificationLabel.innerHTML = autoLabelText;
    parent.appendChild(badgeClassificationLabel);
}

const generateLabelWarning = (parent: HTMLDivElement) => {
    const labelWarning = document.createElement("div");
    labelWarning.innerHTML = "⚠ No label was found!";
    labelWarning.classList.add("acc-text");
    labelWarning.classList.add("acc-warning");
    parent.appendChild(labelWarning);
}

const generateHiddenWarning = (parent: HTMLDivElement) => {
    const hiddenWarning = document.createElement("div");
    hiddenWarning.innerHTML = "⚠ Hidden Input";
    hiddenWarning.classList.add("acc-text");
    hiddenWarning.classList.add("acc-warning");
    parent.appendChild(hiddenWarning);
}

const generateInfoButton = (parent: HTMLDivElement, results: matchingTable) => {
    const infoButton = document.createElement("button");
    infoButton.type = "button";
    infoButton.innerHTML = "ℹ";
    infoButton.title = "click to toggle detailed prediction results";
    infoButton.classList.add("acc-info-button");
    infoButton.addEventListener("click", (e) => {
        //const boundingRect = (e.target as HTMLDivElement).getBoundingClientRect();
        const boundingRect = parent.getBoundingClientRect();
        toggleFloatingInfoTableAtPosition(boundingRect.left + window.scrollX, boundingRect.bottom + window.scrollY, results)
    });
    parent.appendChild(infoButton);
}

export const generateFloatingInfoTable = async () => {
    const floatingTableDiv = document.createElement("div");
    floatingTableDiv.id = "acc-floating-info";
    floatingTableDiv.style.display = "none";

    // set font size from settings
    const fontSizeObj = await chrome.storage.local.get("acc.fontSize");
    const fontSize = fontSizeObj["acc.fontSize"] as string;
    floatingTableDiv.style.fontSize = fontSize;

    // add escape listener to close table
    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape" || event.key === "Esc") {
            hideFloatingInfoTable();
        }
    });

    document.body.appendChild(floatingTableDiv);
}

export const removeFloatingInfoTable = () => {
    const floatingTableDivs = document.getElementById("acc-floating-info");
    floatingTableDivs?.remove();
    // document.removeEventListener()  // currently not done, if there are other listeners
}

const hideFloatingInfoTable = () => {
    const floatingTableDiv = document.getElementById("acc-floating-info");
    if (floatingTableDiv === null) {
        console.log("Floating table div not found, aborting!");
        return;
    }
    floatingTableDiv.style.display = "none";
}

const toggleFloatingInfoTableAtPosition = (x: number, y: number, matchingTable: matchingTable) => {
    const floatingTableDiv = document.getElementById("acc-floating-info");
    if (floatingTableDiv === null) {
        console.log("Floating table div not found, aborting!");
        return;
    }

    // toggle visibility
    if (floatingTableDiv.style.display === "none") {
        setFloatingInfoTableData(floatingTableDiv, matchingTable);
        floatingTableDiv.style.left = `${x+4}px`;
        floatingTableDiv.style.top = `${y+2}px`;
        floatingTableDiv.style.display = "block";
    } else {
        hideFloatingInfoTable();
    }

}

const setFloatingInfoTableData = (div: HTMLElement, matchingTable: matchingTable) => {
    // remove all children of div
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    const table = document.createElement("table");
    const headerRow = document.createElement("tr")
    const headerKey = document.createElement("th");
    const headerValue = document.createElement("th");
    headerKey.textContent = "Value";
    headerValue.textContent = "Confidence (%)";
    headerRow.appendChild(headerKey);
    headerRow.appendChild(headerValue);
    table.appendChild(headerRow);

    for (const entry of matchingTable) {
        const row = document.createElement("tr");
        const val = document.createElement("td");
        const key = document.createElement("td");
        val.textContent = entry.acValue;
        key.textContent = entry.confidenceScore.toFixed(3).toString();
        row.appendChild(val);
        row.appendChild(key);
        table.appendChild(row);
    }
    
    div.appendChild(table);
}

const getAcStatus = (acFound: boolean, valExists: boolean, acVal: string, acPrediction: matchingTableEntry, acThreshold: number, warningFlag: boolean): acStatus => {
    if (acPrediction.confidenceScore >= acThreshold) {
        if (acFound) {
            // possible valExists check here, but stage is effectively useless

            const acValAsList = stringToList(acVal);

            if (acValAsList.includes(acPrediction.acValue)) {
                return "✔ AC OK";
            } else {
                return "❕ AC WRONG";
            }
        } else {
            return "❌ AC WRONG";
        }
    } else {
        if (acFound) {
            return "❕ AC FOUND";
        } else {
            if (warningFlag) {
                return "❕ NO AC FOUND";
            } else {
                return "✔ NO AC NEEDED";
            }
        }
    }
}

const stringToList = (word: string) => {
    if (word.split(" ").length >= 2) {
        return word.split(" ");
    }
    return [word];
}

const generateDevModeUI = (
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
    labeledMatchingItemList: matchingItemWithId[],
    matchingItem: matchingItem,
    ) => {

    const devModeUIDiv = document.createElement("div");

    const tableGrid = document.createElement("table");
    
    const trAddToDb = document.createElement("tr");

    const tdAddToDbLabel = document.createElement("td");
    const addToDBText = document.createElement("p");
    addToDBText.innerHTML = "add todb:";
    addToDBText.className = "acc.devModeText";
    addToDBText.style.padding = "4px";
    tdAddToDbLabel.appendChild(addToDBText);
    
    const tdAddToDbInput = document.createElement("td");
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
    tdAddToDbInput.appendChild(addToDB);

    trAddToDb.appendChild(tdAddToDbLabel);
    trAddToDb.appendChild(tdAddToDbInput);
    tableGrid.appendChild(trAddToDb);

    const tracNeeded = document.createElement("tr");

    const tdacNeededLabel = document.createElement("td");
    const acNeededText = document.createElement("p");
    acNeededText.innerHTML = "ac needed:";
    acNeededText.className = "acc.devModeText";
    acNeededText.style.padding = "4px";
    tdacNeededLabel.appendChild(acNeededText);

    const tdacNeededInput = document.createElement("td");
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
    tdacNeededInput.appendChild(acNeeded);

    tracNeeded.appendChild(tdacNeededLabel);
    tracNeeded.appendChild(tdacNeededInput);
    tableGrid.appendChild(tracNeeded);

    const trvalCorrect = document.createElement("tr");

    const tdvalCorrectLabel = document.createElement("td");
    const valueCorrectText = document.createElement("p");
    valueCorrectText.innerHTML = "website value correct:";
    valueCorrectText.className = "acc.devModeText";
    valueCorrectText.style.padding = "4px";
    tdvalCorrectLabel.appendChild(valueCorrectText);


    const tdvalCorrectInput = document.createElement("td");
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
    tdvalCorrectInput.appendChild(valueCorrect);

    trvalCorrect.appendChild(tdvalCorrectLabel);
    trvalCorrect.appendChild(tdvalCorrectInput);
    tableGrid.appendChild(trvalCorrect);

    const tractualVal = document.createElement("tr");

    const tdactualValLabel = document.createElement("td");
    const actualValueText = document.createElement("p");
    actualValueText.innerHTML = "actual value:";
    actualValueText.className = "acc.devModeText";
    actualValueText.style.padding = "4px";
    tdactualValLabel.appendChild(actualValueText);

    const tdactualValInput = document.createElement("td");
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
    tdactualValInput.appendChild(actualValue);
    tractualVal.appendChild(tdactualValLabel);
    tractualVal.appendChild(tdactualValInput);
    tableGrid.appendChild(tractualVal);


    devModeUIDiv.appendChild(tableGrid);
    devModeUIDiv.style.padding = "4px";

    return devModeUIDiv;
}