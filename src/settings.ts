const saveSettings = () => {
    const devModeChk = <HTMLInputElement>document.getElementById('devModeChk');
    const devModeOn = devModeChk.checked;

    chrome.storage.local.set({ "acc.devMode": devModeOn })

    console.log("saved setting dev mode");
    console.log(`dev mode: ${devModeOn}`);
    
};

document.getElementById('saveBtn')?.addEventListener('click', saveSettings);