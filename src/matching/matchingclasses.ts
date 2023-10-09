import { matchingItem, getIdOfAcName } from "./matching";
import autocompleteDict from "./autocomplete-dict.json";
import matchingClassesInfluence from "./matchingClassesInfluence.json"

export type matchByTopResult = {
    id: string,
    confidence: number}


// search for string occurences in db
export const matchByLabel = (item: matchingItem) => {
    const topResults: matchByTopResult[] = [];

    if (item.label === null) {
        return topResults;
    }

    const labelExamplesEN = autocompleteDict.byLabel_EN as Record<string, string[]>;
    for (const id of Object.keys(labelExamplesEN)) {
        const substringSearchResult = substringSearch(labelExamplesEN[id], item.label);

        if (["full", "partial", "reverse-partial"].includes(substringSearchResult)) {
            topResults.push({id: id, confidence: 1 * matchingClassesInfluence.labelSubstringSearch[substringSearchResult]});
        }
    }

    const labelExamplesDE = autocompleteDict.byLabel_DE as Record<string, string[]>;
    for (const id of Object.keys(labelExamplesDE)) {
        const substringSearchResult = substringSearch(labelExamplesDE[id], item.label);

        if (["full", "partial", "reverse-partial"].includes(substringSearchResult)) {
            
            const foundIndex = topResults.findIndex(i => i.id == id);
            // check if entry alrady exists in results. if so update only confidence score

            // console.log(`found index: ${foundIndex} for "${item.labelText}"`);
            

            if (foundIndex === -1) {
                topResults.push({id: id, confidence: 1 * matchingClassesInfluence.labelSubstringSearch[substringSearchResult]});

            // if en is a direct hit, dont override
            } else if (topResults[foundIndex].confidence === matchingClassesInfluence.labelSubstringSearch["full"]) {
                // do nothing
            // if there is a direct hit, override en search result
            } else if (substringSearchResult === "full") {
                topResults[foundIndex].confidence = matchingClassesInfluence.labelSubstringSearch[substringSearchResult];
            } else {
                topResults[foundIndex].confidence = (topResults[foundIndex].confidence + 1 * matchingClassesInfluence.labelSubstringSearch[substringSearchResult]) / 2;
            }

            
        }
    }


    return weighConfidences(topResults);
}

// search for string occurences in db
export const matchByPlaceholder = (item: matchingItem) => {
    const topResults: matchByTopResult[] = [];

    if (item.placeholder === null) {
        return topResults;
    }

    //TODO add placeholder-keywords_EN
    const labelExamplesEN = autocompleteDict.byLabel_EN as Record<string, string[]>;
    for (const id of Object.keys(labelExamplesEN)) {
        const substringSearchResult = substringSearch(labelExamplesEN[id], item.placeholder);

        if (["full", "partial", "reverse-partial"].includes(substringSearchResult)) {
            topResults.push({id: id, confidence: 1 * matchingClassesInfluence.labelSubstringSearch[substringSearchResult]});
        }
    }

    //TODO add placeholder-keywords_DE
    const labelExamplesDE = autocompleteDict.byLabel_DE as Record<string, string[]>;
    for (const id of Object.keys(labelExamplesDE)) {
        const substringSearchResult = substringSearch(labelExamplesDE[id], item.placeholder)

        if (["full", "partial", "reverse-partial"].includes(substringSearchResult)) {
            
            const foundIndex = topResults.findIndex(i => i.id == id);

            // check if entry alrady exists in results. if so update only confidence score
            if (foundIndex === -1) {
                topResults.push({id: id, confidence: 1 * matchingClassesInfluence.labelSubstringSearch[substringSearchResult]});
            } else {
                topResults[foundIndex].confidence = (topResults[foundIndex].confidence + 1 * matchingClassesInfluence.labelSubstringSearch[substringSearchResult]) / 2;
            }

        }
    }
    

    return weighConfidences(topResults);
}

// search possible Field types
export const matchByFieldType = (item: matchingItem) => {
    const topResults: matchByTopResult[] = [];

    if (item.fieldType === null) {
        return topResults;
    }

    const possibleFieldTypes = autocompleteDict.byFieldType;

    type possibleFieldTypeTypes = "input" | "textarea" | "select";

    if (Object.keys(possibleFieldTypes).includes(item.fieldType)) {
        
        for (const id of possibleFieldTypes[item.fieldType as possibleFieldTypeTypes]) {

            let confidence = 0.75;
            
            if (possibleFieldTypes[item.fieldType as possibleFieldTypeTypes].length < 30) {
                confidence = 1;
            }

            topResults.push({id: `${id}`, confidence: confidence});
        }
    }

    return weighConfidences(topResults);
}

// search possible input types
export const matchByInputType = (item: matchingItem) => {
    const topResults: matchByTopResult[] = [];

    if (item.fieldType !== "input" || item.inputType === null) {
        return topResults;
    }

    //TODO handle exclusive test differently, when item is no input-element

    const possibleInputTypes = autocompleteDict.byInputType;

    if (Object.keys(possibleInputTypes).includes(item.inputType)) {
        
        for (const id of possibleInputTypes[item.inputType]) {

            let confidence = 0.5;
            
            if (possibleInputTypes[item.inputType].length < 5) {
                confidence = 1;
            
            } else if (possibleInputTypes[item.inputType].length > 30) {
                confidence = 0.75;
            }

            topResults.push({id: `${id}`, confidence: confidence});
        }
    }

    return weighConfidences(topResults);
}

export const matchByFormType = (item: matchingItem) => {
    const topResults: matchByTopResult[] = [];
    if (item.formId === undefined) {
        return topResults;
    }
    if (item.formHeadings === null || item.formHeadings.length === 0) {
        return topResults;
    }

    const hits = {
        "login": {
            "full": 0,
            "partial": 0,
            "reverse-partial": 0,
            "none": 0
        },
        "signup": {
            "full": 0,
            "partial": 0,
            "reverse-partial": 0,
            "none": 0
        },
    };

    for (const heading of item.formHeadings) {
        const formTypesEN = autocompleteDict.byFormType_EN as Record<string, string[]>;
        for (const key of Object.keys(formTypesEN)) {
            const substringSearchResult = substringSearch(formTypesEN[key], heading)

            if (key === "login") {
                hits.login[substringSearchResult] = hits.login[substringSearchResult] + 1;
            }

            if (key === "signup") {
                hits.signup[substringSearchResult] = hits.signup[substringSearchResult] + 1;
            }
        }

        const formTypesDE = autocompleteDict.byFormType_DE as Record<string, string[]>;
        for (const key of Object.keys(formTypesDE)) {
            const substringSearchResult = substringSearch(formTypesDE[key], heading)

            if (key === "login") {
                hits.login[substringSearchResult] = hits.login[substringSearchResult] + 1;
            }

            if (key === "signup") {
                hits.signup[substringSearchResult] = hits.signup[substringSearchResult] + 1;
            }
        }
    }

    const loginScore = (hits.login.full * 2) + hits.login.partial;
    const signupScore = (hits.signup.full * 2) + hits.signup.partial;

    const newPasswordId = getIdOfAcName("new-password");
    const currentPasswordId = getIdOfAcName("current-password");

    if (loginScore < signupScore) {
        topResults.push({id: `${newPasswordId}`, confidence: 1});
        topResults.push({id: `${currentPasswordId}`, confidence: 0.5});
    } else {
        topResults.push({id: `${newPasswordId}`, confidence: 0.5});
        topResults.push({id: `${currentPasswordId}`, confidence: 1});
    }

    return weighConfidences(topResults);
}

// uses same values from labels, but has lower confidence in weighting
export const matchByName = (item: matchingItem) => {
    const topResults: matchByTopResult[] = [];

    if (item.name === null) {
        return topResults;
    }

    const labelExamplesEN = autocompleteDict.byLabel_EN as Record<string, string[]>;
    for (const id of Object.keys(labelExamplesEN)) {
        const substringSearchResult = substringSearch(labelExamplesEN[id], item.name);

        if (["full", "partial", "reverse-partial"].includes(substringSearchResult)) {
            topResults.push({id: id, confidence: 1 * matchingClassesInfluence.labelSubstringSearch[substringSearchResult]});
        }
    }

    const labelExamplesDE = autocompleteDict.byLabel_DE as Record<string, string[]>;
    for (const id of Object.keys(labelExamplesDE)) {
        const substringSearchResult = substringSearch(labelExamplesDE[id], item.name);

        if (["full", "partial", "reverse-partial"].includes(substringSearchResult)) {
            
            const foundIndex = topResults.findIndex(i => i.id == id);
            // check if entry alrady exists in results. if so update only confidence score

            if (foundIndex === -1) {
                topResults.push({id: id, confidence: 1 * matchingClassesInfluence.labelSubstringSearch[substringSearchResult]});

            // if en is a direct hit, dont override
            } else if (topResults[foundIndex].confidence === matchingClassesInfluence.labelSubstringSearch["full"]) {
                // do nothing
            // if there is a direct hit, override en search result
            } else if (substringSearchResult === "full") {
                topResults[foundIndex].confidence = matchingClassesInfluence.labelSubstringSearch[substringSearchResult];
            } else {
                topResults[foundIndex].confidence = (topResults[foundIndex].confidence + 1 * matchingClassesInfluence.labelSubstringSearch[substringSearchResult]) / 2;
            }
        }
    }


    return weighConfidences(topResults);
}

// uses same values from labels, but has lower confidence in weighting
export const matchById = (item: matchingItem) => {
    const topResults: matchByTopResult[] = [];

    if (item.id === null) {
        return topResults;
    }

    const labelExamplesEN = autocompleteDict.byLabel_EN as Record<string, string[]>;
    for (const id of Object.keys(labelExamplesEN)) {
        const substringSearchResult = substringSearch(labelExamplesEN[id], item.id);

        if (["full", "partial", "reverse-partial"].includes(substringSearchResult)) {
            topResults.push({id: id, confidence: 1 * matchingClassesInfluence.labelSubstringSearch[substringSearchResult]});
        }
    }

    const labelExamplesDE = autocompleteDict.byLabel_DE as Record<string, string[]>;
    for (const id of Object.keys(labelExamplesDE)) {
        const substringSearchResult = substringSearch(labelExamplesDE[id], item.id);

        if (["full", "partial", "reverse-partial"].includes(substringSearchResult)) {
            
            const foundIndex = topResults.findIndex(i => i.id == id);
            // check if entry alrady exists in results. if so update only confidence score

            if (foundIndex === -1) {
                topResults.push({id: id, confidence: 1 * matchingClassesInfluence.labelSubstringSearch[substringSearchResult]});

            // if en is a direct hit, dont override
            } else if (topResults[foundIndex].confidence === matchingClassesInfluence.labelSubstringSearch["full"]) {
                // do nothing
            // if there is a direct hit, override en search result
            } else if (substringSearchResult === "full") {
                topResults[foundIndex].confidence = matchingClassesInfluence.labelSubstringSearch[substringSearchResult];
            } else {
                topResults[foundIndex].confidence = (topResults[foundIndex].confidence + 1 * matchingClassesInfluence.labelSubstringSearch[substringSearchResult]) / 2;
            }
        }
    }


    return weighConfidences(topResults);
}


//weighs the confidence, based on the length of results and average confidence
const weighConfidences = (data: matchByTopResult[]) => {
    const totalConfidence = data.reduce((sum, item) => sum + item.confidence, 0);
    const averageWeigth = totalConfidence / data.length;

    //recalculate weights per item
    const newWeights = data.map(item => ({ id: item.id, confidence: item.confidence * averageWeigth }));

    
    return data;
    //return newWeights;
}


export const substringSearch = (labelExamples: string[], labelText: string) => {
    // search for full occurences
    if (labelExamples.map(label => sanitizeKeyword(label)).includes(sanitizeKeyword(labelText))) {
        return "full";
    }

    // split by n-whitespaces, filter out empty strings
    const labelWords = labelText.split(/\s+/).filter(Boolean);

    let partialHit = false;
    let reversePartialHit = false;

    // search for partial occurences (substrings in both label and examples)
    for (const word of labelWords) {
        
        // do not search for empty strings
        const sanitizedWord = sanitizeKeyword(word);
        if (sanitizedWord === "") {
            continue;
        }

        // only perform partiual searches on words, taht are at least 3 characters long, to avoid arbitrary matches
        if (sanitizedWord.length < 3) {
            continue;
        }

        // if any word is a substring in any label array, return partial
        // example: dict="telephone", word="phone"
        if (labelExamples.some(label => sanitizeKeyword(label).indexOf(sanitizedWord) !== -1)) {
            partialHit = true;
        }
        
        // if any dict entry is substring of label word, return partial
        // example: dict="phone", word="telephone"
        if (labelExamples.some(label => sanitizedWord.indexOf(sanitizeKeyword(label)) !== -1)) {
            reversePartialHit = true;
            
        }
    }

    // partial is higher valued, than reversehit
    if (partialHit) {
        return "partial";
    }

    if (reversePartialHit) {
        return "reverse-partial";
    }

    return "none";
}

const sanitizeKeyword = (keyword: string) => {
    // remove whitespace and keep only alphanumeric chars, set to lowercase
    return keyword.replace(" ", "").replace(/\W/g, '').toLowerCase();
}
