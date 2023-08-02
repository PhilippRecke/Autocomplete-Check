const setHighlighting = async () => {

    const currentHighlightState = await chrome.storage.local.get(["acc.highlight"]);

    if (currentHighlightState["acc.highlight"]) {

        console.log("add highlights");

        const inputElements = document.getElementsByTagName("input");

        console.log(inputElements);

        for (const element of inputElements) {
            

            if (element.type !== "hidden") {

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
                badgeText.innerHTML = `value: ${autocompleteVal}`;

                badgeContainer.appendChild(badgeIcon);
                badgeContainer.appendChild(badgeText);

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
        for (var i = cssBadges.length -1; i >= 0; --i) {
            cssBadges[i].remove(); //TODO check browser compatibility
        }

    }



}


console.log("contentscript injected!");

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.msg === "acc.toggleHighlightContent") {

            setHighlighting();

            sendResponse({ status: true });
        }
    }
);