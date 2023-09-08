import autocompleteDict from './autocomplete-dict.json';
import { matchByFieldType, matchByInputType, matchByLabel, matchByTopResult } from './matchingclasses';


type inputType = "button" | "checkbox" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week";

export type matchingItem = {
    labelText?: string;
    inputName?: string;
    inputType?: inputType;
    fieldType?: string;
    inputPlaceholder?: string;
    inputPattern?: string
    inputRequired?: boolean;
}

type valueGuess = {
    value: string;
    confidence: number;
}

type matchResult = {
    guessedValues: valueGuess[];    // list of possible values, with confidence score
    useCorrect: boolean;            // if the "autocomplete" attribute should be used
    valueCorrect?: boolean;         // if the given value of "autocomplete" is correct
    confidenceUse: number;          // confidence score for "useCorrect"
    confidenceValue: number;        // confidence score for "valueCorrect"
}


export const generateMatchingItem = (input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, document: Document) => {

    const itemResult: matchingItem = {};

    itemResult.inputType = input.type as inputType; //TODO error, when invalid type?
    itemResult.inputName = input.name;
    itemResult.fieldType = input.tagName.toLowerCase();
    
    const labelList = [...document.getElementsByTagName('label')]
        .filter(label => label.htmlFor == input.id)
        .map(labelItem => {
            return labelItem.innerText;
        });
        
    itemResult.labelText = labelList[0];

    if (!(input instanceof HTMLSelectElement)) {
        itemResult.inputPlaceholder = input.placeholder == "" ? undefined : input.placeholder;
    }

    itemResult.inputRequired = input.required;

    return itemResult;
}

export type matchingTable = {acValue: string, acId: string, confidenceScore: number}[]

export const analyzeForm = (data: matchingItem[]) => {
    

    // autocompleteValue.values;

    // check individual field

    // crosscheck fields (clashes with confidence delta >= 10, confidence >= 60)

    /*
    for (const item of data){
        const labelResults = matchByLabel(item);
        const fieldTypeResults = matchByFieldType(item);
        const inputTypeResults =  matchByInputType(item);

        const matchingTableResult = evaluateMatchingClassesResults({
            labelResult: labelResults,
            fieldTypeResult: fieldTypeResults,
            inputTypeResult: inputTypeResults
        });

    }
    */
}

export const analyzeField = (data: matchingItem) => {

    const labelResults = matchByLabel(data);
    //console.log(labelResults);
    
    const fieldTypeResults = matchByFieldType(data);
    //console.log(fieldTypeResults);

    const inputTypeResults =  matchByInputType(data);
    //console.log(inputTypeResults);

    const matchingTableResult = evaluateMatchingClassesResults({
        labelResult: labelResults,
        fieldTypeResult: fieldTypeResults,
        inputTypeResult: inputTypeResults
    });

    //TODO do something with this
    //console.log(`classifyresult: ${matchingTableResult}`);

    const sortedMatchingResults = matchingTableResult.sort((a, b) => b.confidenceScore - a.confidenceScore);
    //console.log(sortedMatchingResults);

    return sortedMatchingResults;
}


type matchingClassesResult = {labelResult: matchByTopResult[], fieldTypeResult: matchByTopResult[], inputTypeResult: matchByTopResult[]}

const evaluateMatchingClassesResults = (matchingClassesResultObject: matchingClassesResult) => {
    const matchingTableResult: matchingTable = [];
    
    for (const lr of matchingClassesResultObject.labelResult) {
        updateMatchingTableEntry(matchingTableResult, lr);
    }

    for (const ftr of matchingClassesResultObject.fieldTypeResult) {
        updateMatchingTableEntry(matchingTableResult, ftr);
    }

    for (const itr of matchingClassesResultObject.inputTypeResult) {
        updateMatchingTableEntry(matchingTableResult, itr);
    }

    return matchingTableResult;
}

const getNameOfAcId = (id: string) => {
    //@ts-ignore //TODO
    const foundIndex = Object.keys(autocompleteDict.byId).indexOf(id);
    if (foundIndex === -1) {
        return "!ERROR!";
    } else {
        //@ts-ignore //TODO
        return (autocompleteDict.byId[id] as string);
    }
}

const updateMatchingTableEntry = (table: matchingTable, matchResult: matchByTopResult) => {
    const foundIndex = table.findIndex(i => i.acId == matchResult.id);
    // check if entry alrady exists in table. if so update only confidence score
    if (foundIndex === -1) {
        table.push({acValue: getNameOfAcId(matchResult.id), acId: matchResult.id, confidenceScore: matchResult.confidence })
    } else {
        table[foundIndex].confidenceScore = table[foundIndex].confidenceScore + matchResult.confidence;
    }
}