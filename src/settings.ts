const saveSettings = async () => {
    const showHiddenChk = <HTMLInputElement>document.getElementById("showHiddenChk");
    const showHiddenOn = showHiddenChk.checked;
    await chrome.storage.local.set({ "acc.showHidden": showHiddenOn })

    const highlightHoverChk = <HTMLInputElement>document.getElementById("highlightHoverChk");
    const highlightHoverOn = highlightHoverChk.checked;
    await chrome.storage.local.set({ "acc.highlightHover": highlightHoverOn })

    const onlyTestFormsChk = <HTMLInputElement>document.getElementById("onlyTestFormsChk");
    const onlyTestFormsOn = onlyTestFormsChk.checked;
    await chrome.storage.local.set({ "acc.onlyTestForms": onlyTestFormsOn })

    const devModeChk = <HTMLInputElement>document.getElementById("devModeChk");
    const devModeOn = devModeChk.checked;
    await chrome.storage.local.set({ "acc.devMode": devModeOn })

};

const loadValuesFromStorage = async () => {
    const showHiddenChk = <HTMLInputElement>document.getElementById("showHiddenChk");
    const showHiddenObj = await chrome.storage.local.get("acc.showHidden")
    showHiddenChk.checked = showHiddenObj["acc.showHidden"] as boolean

    const highlightHoverChk = <HTMLInputElement>document.getElementById("highlightHoverChk");
    const highlightHoverObj = await chrome.storage.local.get("acc.highlightHover")
    highlightHoverChk.checked = highlightHoverObj["acc.highlightHover"] as boolean

    const onlyTestFormsChk = <HTMLInputElement>document.getElementById("onlyTestFormsChk");
    const onlyTestFormsObj = await chrome.storage.local.get("acc.onlyTestForms")
    onlyTestFormsChk.checked = onlyTestFormsObj["acc.onlyTestForms"] as boolean

    const devModeChk = <HTMLInputElement>document.getElementById("devModeChk");
    const devModeObj = await chrome.storage.local.get("acc.devMode")
    devModeChk.checked = devModeObj["acc.devMode"] as boolean
}

const init = () => {
    loadValuesFromStorage();
    document.getElementById("saveBtn")?.addEventListener('click', saveSettings);
}


document.addEventListener('DOMContentLoaded', init);

