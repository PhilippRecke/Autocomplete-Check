import { matchingItem } from "./matching";
import autocompleteDict from "./autocomplete-dict.json";
import matchingClassesInfluence from "./matchingClassesInfluence.json"

export type matchByTopResult = {id: string, confidence: number}


// search for string occurences in db
export const matchByLabel = (item: matchingItem) => {
    const topResults: matchByTopResult[] = [];

    if (item.labelText === undefined) {
        return topResults;
    }

    //remove w2hitespace and keep only alphanumeric cahrs, set to lowercase
    const tmpLabelText = item.labelText
        .replace(" ", "")
        .replace(/\W/g, '')
        .toLowerCase();

    const labelExamplesEN = autocompleteDict.byLabel_EN;
    for (const id of Object.keys(labelExamplesEN)) {
        //@ts-ignore //TODO
        if (labelExamplesEN[id].includes(tmpLabelText)) {
            topResults.push({id: id, confidence: 1 * matchingClassesInfluence.matchByLabel})
        }
    }

    const labelExamplesDE = autocompleteDict.byLabel_DE;
    for (const id of Object.keys(labelExamplesDE)) {
        //@ts-ignore //TODO
        if (labelExamplesDE[id].includes(tmpLabelText)) {
            
            const foundIndex = topResults.findIndex(i => i.id == id);
            // check if entry alrady exists in results. if so update only confidence score
            if (foundIndex === -1) {
                topResults.push({id: id, confidence: 1 * matchingClassesInfluence.matchByLabel})
            } else {
                topResults[foundIndex].confidence = topResults[foundIndex].confidence + 1 * matchingClassesInfluence.matchByLabel;
            }

            
        }
    }
    

    return weighConfidences(topResults);
}

// search possible Field types
export const matchByFieldType = (item: matchingItem) => {
    const topResults: matchByTopResult[] = [];

    if (item.fieldType === undefined) {
        return topResults;
    }

    const possibleFieldTypes = autocompleteDict.byFieldType;

    if (Object.keys(possibleFieldTypes).includes(item.fieldType)) {
        //@ts-ignore //TODO
        for (const id of possibleFieldTypes[item.fieldType]) {

            let confidence = 1 * matchingClassesInfluence.matchByFieldType;
            //@ts-ignore //TODO
            if (possibleFieldTypes[item.fieldType].lenght < 30) {
                confidence = 1.5 * matchingClassesInfluence.matchByFieldType;
            }

            topResults.push({id: `${id}`, confidence: confidence})
        }
    }

    return weighConfidences(topResults);
}

// search possible input types
export const matchByInputType = (item: matchingItem) => {
    const topResults: matchByTopResult[] = [];

    if (item.fieldType !== "input" || item.inputType === undefined) {
        return topResults;
    }

    const possibleInputTypes = autocompleteDict.byInputType;

    if (Object.keys(possibleInputTypes).includes(item.inputType)) {
        //@ts-ignore //TODO
        for (const id of possibleInputTypes[item.inputType]) {

            let confidence = 1 * matchingClassesInfluence.matchByInputType;
            //@ts-ignore //TODO
            if (possibleInputTypes[item.inputType].lenght < 5) {
                confidence = 2 * matchingClassesInfluence.matchByInputType;
            //@ts-ignore //TODO
            } else if (possibleInputTypes[item.inputType].lenght > 30) {
                confidence = 1.5 * matchingClassesInfluence.matchByInputType;
            }

            topResults.push({id: `${id}`, confidence: confidence})
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
    //console.log(newWeights);
    
    return newWeights;
}
