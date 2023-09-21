import autocompleteDict from './autocomplete-dict.json';
import { matchByFieldType, matchByFormType, matchByInputType, matchByLabel, matchByPlaceholder, matchByTopResult } from './matchingclasses';
import matchingClassesInfluence from "./matchingClassesInfluence.json"

type inputType = "button" | "checkbox" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week";

export type matchingItem = {
    formId?: string;
    formHeadings?: string[];
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


export const generateMatchingItem = (input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, document: Document, formId?: string) => {

    const itemResult: matchingItem = {};

    itemResult.formId = formId;
    itemResult.formHeadings = getHeadingsOfForm(document, formId);

    itemResult.inputType = input.type as inputType; //TODO error, when invalid type?
    itemResult.inputName = input.name;
    itemResult.fieldType = input.tagName.toLowerCase();

    const labelList = [...document.getElementsByTagName('label')]
        .filter(label => label.htmlFor == input.id);
    
    console.log(labelList);
    console.log(labelList[0]?.innerText);

    itemResult.labelText = labelList[0]?.innerText;

    if (!(input instanceof HTMLSelectElement)) {
        itemResult.inputPlaceholder = input.placeholder == "" ? undefined : input.placeholder;
    }

    itemResult.inputRequired = input.required;

    return itemResult;
}

export type matchingTable = matchingTableEntry[]
export type matchingTableEntry = {acValue: string, acId: string, confidenceScore: number}

type testResultsByClass = {
    classId: string,
    resultsAndWeights: {
        result: number,
        weight: number
    }[]
}

type testResults = testResultsByClass[];

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

    const testResults = generateEmptyTestResults();

    const labelResults = matchByLabel(data);
    console.log(labelResults);
    updateTestResults(testResults, labelResults, matchingClassesInfluence.matchBy.Label)
    
    const placeholderResults = matchByPlaceholder(data);
    console.log(placeholderResults);
    updateTestResults(testResults, placeholderResults, matchingClassesInfluence.matchBy.Placeholder)

    const fieldTypeResults = matchByFieldType(data);
    console.log(fieldTypeResults);
    updateTestResults(testResults, fieldTypeResults, matchingClassesInfluence.matchBy.FieldType)

    const inputTypeResults =  matchByInputType(data);
    console.log(inputTypeResults);
    updateTestResults(testResults, inputTypeResults, matchingClassesInfluence.matchBy.InputType)

    const formTypeResults =  matchByFormType(data);
    console.log(formTypeResults);
    updateTestResults(testResults, formTypeResults, matchingClassesInfluence.matchBy.FormType)

    

    const matchingTableResult = weighTestResults(testResults);

    /*
    const matchingTableResult = evaluateMatchingClassesResults({
        labelResult: labelResults,
        fieldTypeResult: fieldTypeResults,
        inputTypeResult: inputTypeResults
    });
    */

    //console.log(`classifyresult: ${matchingTableResult}`);

    const sortedMatchingResults = matchingTableResult.sort((a, b) => b.confidenceScore - a.confidenceScore);
    console.log(sortedMatchingResults);

    return sortedMatchingResults;
}


type matchingClassesResult = {labelResult: matchByTopResult[], fieldTypeResult: matchByTopResult[], inputTypeResult: matchByTopResult[]}
/*
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
*/

export const getNameOfAcId = (id: string) => {
    const foundIndex = Object.keys(autocompleteDict.byId).indexOf(id);
    if (foundIndex === -1) {
        return "!ERROR!";
    } else {
        //@ts-ignore //TODO
        return (autocompleteDict.byId[id] as string);
    }
}

export const getIdOfAcName = (name: string) => {
    const foundIndex = Object.entries(autocompleteDict.byId).map(([key, value]) => value).indexOf(name);
    if (foundIndex === -1) {
        return "!ERROR!";
    } else {
        //@ts-ignore //TODO
        return (Object.keys(autocompleteDict.byId)[foundIndex] as string);
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

const generateEmptyTestResults = () => {
    // generates a table with one column for each sutocomplete-class
    const testResults: testResults = [];
    for (const key of Object.keys(autocompleteDict.byId)) {
        testResults.push({
            classId: key,
            resultsAndWeights: []
        });
    }
    return testResults;
}


const updateTestResults = (testResults: testResults, newResults: matchByTopResult[], testInfluence: number) => {
    //TODO set 0 even in classes, that are not returned (test still failed)
    // empty list, to be populated with negative test results (0 confidence score)
    const tmpResults: matchByTopResult[] = [...newResults];

    for (const key of Object.keys(autocompleteDict.byId)) {
        // if a class (key) is not in newResults, populate tmpResults with 0-entry
        if (!newResults.find(r => r.id === key)) {
            tmpResults.push({
                id: key,
                confidence: 0
            });
        }
    }

    for (const newResult of tmpResults) {
        const foundIndex = testResults.findIndex(i => i.classId == newResult.id);
        const newResultsAndWeightsItem = {result: newResult.confidence, weight: testInfluence};

        if (foundIndex === -1) {
            testResults.push({
                classId: newResult.id,
                resultsAndWeights: [newResultsAndWeightsItem]
            });
        } else {
            testResults[foundIndex].resultsAndWeights.push(newResultsAndWeightsItem);
        }
    }

    
}

// generated weighted average per class
const weighTestResults = (testResults: testResults) => {

    // TODO ensure uniqueness!!!
    const table: matchingTable = [];

    for (const classResult of testResults) {
        const weightedSum = classResult.resultsAndWeights.reduce((sum, item) => sum + (item.result * item.weight), 0)
        const summedInfluences = classResult.resultsAndWeights.reduce((sum, item) => sum + item.weight, 0)
        const weigtedResult = weightedSum / summedInfluences;

        table.push({acValue: getNameOfAcId(classResult.classId), acId: classResult.classId, confidenceScore: weigtedResult })
    } 
    
    return table;
}

const getHeadingsOfForm = (doc: Document, formId?: string) => {
    const headings: string[] = [];

    if (formId === undefined) {
        return headings;
    }

    const form = doc.getElementById(formId);
    
    if (form === null) {
        return headings;
    }

    const headingTags = ["h1", "h2", "h3", "h4", "h5", "h6"];

    for (const hx of headingTags) {
        const hs = form.getElementsByTagName(hx);
        for (const h of hs) {
            if (h.innerHTML === ""){
                continue;
            }
            headings.push(h.innerHTML);
        }
    }

    return headings;
}
