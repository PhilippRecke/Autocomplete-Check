import { matchingItemWithId } from "../content-script";
import { matchingTable, matchingItem, matchingTableEntry } from "../matching/matching";
import autocompleteDict from '../matching/autocomplete-values.json';

type acStatus = "✔" | "❌" | "❕";

export const generateAutocompleteBadge = async (
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
    labeledResults: matchingTable,
    matchingItem: matchingItem,
    labeledMatchingItemList: matchingItemWithId[], // for db labeling
    badgeId: number
    ) => {

    const autocompleteExists = element.hasAttribute("autocomplete");
    let autocompleteVal = element.getAttribute("autocomplete");
    if (autocompleteVal === null) {
        autocompleteVal = "value missing";
    }
    
    const autocompleteIsValidValue = autocompleteDict.values.includes(autocompleteVal);

    const badgeContainer = document.createElement("div");
    badgeContainer.className = "acc-badge"
    badgeContainer.addEventListener("click", (e) => {
        console.log("badge clicked");

        //const boundingRect = (e.target as HTMLDivElement).getBoundingClientRect();
        const boundingRect = badgeContainer.getBoundingClientRect();

        showFloatingInfoTableAtPosition(boundingRect.left + window.scrollX, boundingRect.top + window.scrollY, labeledResults)
    });
    
    
    // do highlighthover, if set in settings
    const highlightHoverObj = await chrome.storage.local.get("acc.highlightHover")
    if (highlightHoverObj["acc.highlightHover"] as boolean) {
        badgeContainer.addEventListener('mouseover',  () => {
            element.classList.add("acc-tmp-hover")
        });
        badgeContainer.addEventListener('mouseout', () => {
            element.classList.remove("acc-tmp-hover")
        });
    }

    const autocompleteStatus = getAcStatus(autocompleteExists, autocompleteIsValidValue, autocompleteVal, labeledResults[0])

    const badgeIcon = document.createElement("div");
    const badgeText = document.createElement("div");

    badgeIcon.innerHTML = autocompleteStatus;
    badgeText.innerHTML = `autocomplete: ${autocompleteVal}`;

    switch (autocompleteStatus) {
        case "✔":
            badgeIcon.className = "acc-icon acc-correct";
            badgeText.className = "acc-text acc-correct";
            break;
        case "❕":
            badgeIcon.className = "acc-icon acc-info";
            badgeText.className = "acc-text acc-info";
            break;
        default:
            badgeIcon.className = "acc-icon acc-false";
            badgeText.className = "acc-text acc-false";
    }

    badgeContainer.appendChild(badgeIcon);
    badgeContainer.appendChild(badgeText);


    let autoLabelText;
    if (labeledResults[0].acValue === autocompleteVal) {
        autoLabelText = `${labeledResults[0].confidenceScore.toFixed(1)}`;
    } else {
        autoLabelText = `${labeledResults[0].acValue}: ${labeledResults[0].confidenceScore.toFixed(1)}`
    }

    const badgeClassificationLabel = document.createElement("div");
    badgeClassificationLabel.classList.add("acc-classificationLabel", "acc-text");
    badgeClassificationLabel.innerHTML = autoLabelText;

    badgeContainer.appendChild(badgeClassificationLabel);


    // only for devMode (db)
    const devModeObj = await chrome.storage.local.get(["acc.devMode"]);
    const devMode = devModeObj["acc.devMode"] as boolean;

    if (devMode) {
        const devDiv = generateDevModeUI(element, labeledMatchingItemList, matchingItem);
        badgeContainer.appendChild(devDiv);
    }

    return badgeContainer;

}

export const generateFloatingInfoTable = () => {
    const floatingTableDiv = document.createElement("div");
    floatingTableDiv.id = "acc-floating-info";
    floatingTableDiv.innerText = "testasdf";
    document.body.appendChild(floatingTableDiv);
}

export const removeFloatingInfoTable = () => {
    const floatingTableDivs = document.getElementById("acc-floating-info");
    floatingTableDivs?.remove();
}

const showFloatingInfoTableAtPosition = (x: number, y: number, matchingTable: matchingTable) => {
    const floatingTableDiv = document.getElementById("acc-floating-info");
    if (floatingTableDiv === null) {
        console.log("Floating table div not found, aborting!");
        return;
    }

    setFloatingInfoTableData(floatingTableDiv, matchingTable);

    floatingTableDiv.style.left = `${x}px`;
    // TODO ensure badge height is 22, otherwise do dynamically
    floatingTableDiv.style.top = `${y+22}px`;
    floatingTableDiv.style.display = "block";
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

const hideFloatingInfoTable = () => {
    const floatingTableDiv = document.getElementById("acc-floating-info");
    if (floatingTableDiv === null) {
        console.log("Floating table div not found, aborting!");
        return;
    }

    floatingTableDiv.style.display = "none";
}

const getAcStatus = (acExists: boolean, valExists: boolean, acVal: string, acPrediction: matchingTableEntry): acStatus => {

    if (!acExists) {
        return "❌";
    }

    if (!valExists) {
        return "❕";
    }

    if (acVal === acPrediction.acValue && acPrediction.confidenceScore >= 0.5) {
        return "✔";
    }
    
    return "❕";
}

const generateDevModeUI = (
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
    labeledMatchingItemList: matchingItemWithId[],
    matchingItem: matchingItem,
    ) => {

    const devModeUIDiv = document.createElement("div");

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

    devModeUIDiv.appendChild(addToDBText);
    devModeUIDiv.appendChild(addToDB);
    devModeUIDiv.appendChild(acNeededText);
    devModeUIDiv.appendChild(acNeeded);
    devModeUIDiv.appendChild(valueCorrectText);
    devModeUIDiv.appendChild(valueCorrect);
    devModeUIDiv.appendChild(actualValue);

    return devModeUIDiv;
}