const saveSettings = async (e: Event) => {

    const form = e.target;
    
    //dont reaload page
    e.preventDefault();

    if (form === null) { return; }

    
    //const showHiddenChk = <HTMLInputElement>document.getElementById("showHiddenChk");
    //@ts-ignore
    const showHiddenChk = form.showHiddenChk;
    const showHiddenOn = showHiddenChk.checked;
    await chrome.storage.local.set({ "acc.showHidden": showHiddenOn });

    //const showDisabledChk = <HTMLInputElement>document.getElementById("showDisabledChk");
    //@ts-ignore
    const showDisabledChk = form.showDisabledChk;
    const showDisabledOn = showDisabledChk.checked;
    await chrome.storage.local.set({ "acc.showDisabled": showDisabledOn });

    //const highlightHoverChk = <HTMLInputElement>document.getElementById("highlightHoverChk");
    //@ts-ignore
    const highlightHoverChk = form.highlightHoverChk;
    const highlightHoverOn = highlightHoverChk.checked;
    await chrome.storage.local.set({ "acc.highlightHover": highlightHoverOn });

    //const hoverColorObj = <HTMLInputElement>document.getElementById("hoverColor");
    //@ts-ignore
    const hoverColorObj = form.hoverColor;
    const hoverColor = hoverColorObj.value;
    await chrome.storage.local.set({ "acc.hoverColor": hoverColor });

    //const fontSizeObj = <HTMLInputElement>document.getElementById("fontSize");
    //@ts-ignore
    const fontSizeObj = form.fontSize;
    const fontSize = fontSizeObj.value;
    await chrome.storage.local.set({ "acc.fontSize": fontSize });

    //const onlyTestFormsChk = <HTMLInputElement>document.getElementById("onlyTestFormsChk");
    //@ts-ignore
    const onlyTestFormsChk = form.onlyTestFormsChk;
    const onlyTestFormsOn = onlyTestFormsChk.checked;
    await chrome.storage.local.set({ "acc.onlyTestForms": onlyTestFormsOn });

    //const floatBadgeChk = <HTMLInputElement>document.getElementById("floatBadgeChk");
    //@ts-ignore
    const floatBadgeChk = form.floatBadgeChk;
    const floatBadgeOn = floatBadgeChk.checked;
    await chrome.storage.local.set({ "acc.floatBadge": floatBadgeOn });

    //const classThreshold = <HTMLInputElement>document.getElementById("classThreshold");
    //@ts-ignore
    const classThreshold = form.classThreshold;
    const classThresholdVal = classThreshold.value;
    await chrome.storage.local.set({ "acc.classThreshold": classThresholdVal }); 

    //const devModeChk = <HTMLInputElement>document.getElementById("devModeChk");
    //@ts-ignore
    const devModeChk = form.devModeChk;
    const devModeOn = devModeChk.checked;
    await chrome.storage.local.set({ "acc.devMode": devModeOn });

    //const dbUrlTxtObj = <HTMLInputElement>document.getElementById("dbUrlTxt");
    //@ts-ignore
    const dbUrlTxtObj = form.dbUrlTxt;
    const dbUrlTxt = dbUrlTxtObj.value;
    await chrome.storage.local.set({ "acc.dbUrlTxt": dbUrlTxt });

    //const dbUsrTxtObj = <HTMLInputElement>document.getElementById("dbUsrTxt");
    //@ts-ignore
    const dbUsrTxtObj = form.dbUsrTxt;
    const dbUsrTxt = dbUsrTxtObj.value;
    await chrome.storage.local.set({ "acc.dbUsrTxt": dbUsrTxt });

    //const dbPwdTxtObj = <HTMLInputElement>document.getElementById("dbPwdTxt");
    //@ts-ignore
    const dbPwdTxtObj = form.dbPwdTxt;
    const dbPwdTxt = dbPwdTxtObj.value;
    await chrome.storage.local.set({ "acc.dbPwdTxt": dbPwdTxt });
    
    alert("Settings saved!");
};

const loadValuesFromStorage = async () => {
    const showHiddenChk = <HTMLInputElement>document.getElementById("showHiddenChk");
    const showHiddenObj = await chrome.storage.local.get("acc.showHidden");
    showHiddenChk.checked = showHiddenObj["acc.showHidden"] as boolean;

    const showDisabledChk = <HTMLInputElement>document.getElementById("showDisabledChk");
    const showDisabledObj = await chrome.storage.local.get("acc.showDisabled");
    showDisabledChk.checked = showDisabledObj["acc.showDisabled"] as boolean;

    const highlightHoverChk = <HTMLInputElement>document.getElementById("highlightHoverChk");
    const highlightHoverObj = await chrome.storage.local.get("acc.highlightHover");
    highlightHoverChk.checked = highlightHoverObj["acc.highlightHover"] as boolean;

    const hoverColorInput = <HTMLInputElement>document.getElementById("hoverColor");
    const hoverColorObj = await chrome.storage.local.get("acc.hoverColor");
    hoverColorInput.value = hoverColorObj["acc.hoverColor"] as string;

    const fontSizeInput = <HTMLInputElement>document.getElementById("fontSize");
    const fontSizeObj = await chrome.storage.local.get("acc.fontSize");
    fontSizeInput.value = fontSizeObj["acc.fontSize"] as string;

    const onlyTestFormsChk = <HTMLInputElement>document.getElementById("onlyTestFormsChk");
    const onlyTestFormsObj = await chrome.storage.local.get("acc.onlyTestForms");
    onlyTestFormsChk.checked = onlyTestFormsObj["acc.onlyTestForms"] as boolean;
    
    const floatBadgeChk = <HTMLInputElement>document.getElementById("floatBadgeChk");
    const floatBadgeObj = await chrome.storage.local.get("acc.floatBadge");
    floatBadgeChk.checked = floatBadgeObj["acc.floatBadge"] as boolean;

    const classThreshold = <HTMLInputElement>document.getElementById("classThreshold");
    const classThresholdObj = await chrome.storage.local.get("acc.classThreshold");
    classThreshold.value = classThresholdObj["acc.classThreshold"] as string;

    const devModeChk = <HTMLInputElement>document.getElementById("devModeChk");
    const devModeObj = await chrome.storage.local.get("acc.devMode");
    devModeChk.checked = devModeObj["acc.devMode"] as boolean;
    
    const dbUrlTxt = <HTMLInputElement>document.getElementById("dbUrlTxt");
    const dbUrlTxtObj = await chrome.storage.local.get("acc.dbUrlTxt");
    dbUrlTxt.value = dbUrlTxtObj["acc.dbUrlTxt"] as string;

    const dbUsrTxt = <HTMLInputElement>document.getElementById("dbUsrTxt");
    const dbUsrTxtObj = await chrome.storage.local.get("acc.dbUsrTxt");
    dbUsrTxt.value = dbUsrTxtObj["acc.dbUsrTxt"] as string;

    const dbPwdTxt = <HTMLInputElement>document.getElementById("dbPwdTxt");
    const dbPwdTxtObj = await chrome.storage.local.get("acc.dbPwdTxt");
    dbPwdTxt.value = dbPwdTxtObj["acc.dbPwdTxt"] as string;

}

const testDbConnection = async () => {

    const dbUrlTxtObj = <HTMLInputElement>document.getElementById("dbUrlTxt");
    const dbUrl = dbUrlTxtObj.value;
    
    const dbUsrTxtObj = <HTMLInputElement>document.getElementById("dbUsrTxt");
    const dbUsr = dbUsrTxtObj.value;

    const dbPwdTxtObj = <HTMLInputElement>document.getElementById("dbPwdTxt");
    const dbPwd = dbPwdTxtObj.value;


    await fetch(`${dbUrl}/autocompletecheck-db/`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + btoa(`${dbUsr}:${dbPwd}`),
            }
        }
    ).then((res) => {
        switch (res.statusText) {
            case "OK":
                alert("OK.");
                break;
            case "Unauthorized":
                alert("Error: Unauthorized!");
                break;
            default:
                alert(res.statusText);
        }

    }).catch((error) => {
        alert(error);
    });



}

const init = () => {
    loadValuesFromStorage();

    //document.getElementById("saveBtn")?.addEventListener("click", saveSettings);


    document.getElementById("dbTestBtn")?.addEventListener("click", testDbConnection);

    document.getElementById("settingsForm")?.addEventListener("submit", saveSettings);

}


document.addEventListener("DOMContentLoaded", init);

