import { dbFieldItem, dbFormItem } from '../db/dbtypes';
import autocompleteDict from './autocomplete-dict.json';
import { matchByFieldType, matchByFormType, matchById, matchByInputType, matchByLabel, matchByName, matchByPlaceholder, matchByTopResult } from './matchingclasses';
import classesInfluence from "./matchingClassesInfluence.json"

type inputType = "button" | "checkbox" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week";

export type matchingItem = dbFieldItem;
/*
{
    fieldId?: string;
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
*/

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


export const generateMatchingItem = (input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, document: Document, posInFields: number, posInForm: number, formId?: string) => {

    const labelList = [...document.getElementsByTagName('label')]
        .filter(label => label.htmlFor == input.id);

    const selectCollection = input instanceof HTMLSelectElement ? input.options : null;
    let selectList: string[] | null = null;
    const selectListValues: string[] = [];
    if (selectCollection !== null) {
        for (const item of selectCollection) {
            selectListValues.push(item.value);
        }
        selectList = selectListValues;
    }


    const itemResult: matchingItem = {
        id: input.id,

        formId: formId? formId : null,
        positionInForm: posInForm,
        formHeadings: getHeadingsOfForm(document, formId),
        positionInFields: posInFields,
        label: labelList[0]?.textContent?.trim() ?? null,
        name: input.name,
        value: input.value,
        checked: input instanceof HTMLInputElement ? input.checked : null,
        selectValues: selectList,
        ariaLabel: input.getAttribute("aria-label"),
        ariaDisabled: input.ariaDisabled as boolean | null,
        ariaHidden: input.getAttribute("aria-hidden") as boolean | null,
        inputType: input.type as inputType, //TODO error, when invalid type?
        fieldType: input.tagName.toLowerCase(),
        isInTable: isElementInsideTableCell(input),
        autocomplete: input.getAttribute("autocomplete"),
        correctAutocomplete: null,

        placeholder: input.getAttribute("placeholder"),
        maxLength: input.getAttribute("maxLength") === null ? null : Number(input.getAttribute("maxLength")),
        disabled: input.getAttribute("disabled") as boolean | null,
        required: input.required,
        pattern: input.getAttribute("pattern")

    };

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

export const parseAllForms = (document: Document) => {
    const forms = document.getElementsByTagName("form");
    const tmpForms = [];
    for (let i = 0; i < forms.length; i++) {
        const tmpFormItem: dbFormItem = {
            id: forms[i].id,
            numOfLabeledFields: -1,
            numOfFields: Array.from(document.querySelectorAll('input, textarea, select')).filter((item) => item.className !== "acc.devModeInput").length,  //TODO include counter for hidden/non visible items?
            positionInForms: i,
            headingTexts: getHeadingsOfForm(document, forms[i].id),
            submitText: getSubmitTextOfForm(document, forms[i].id),
            autocomplete: forms[i].getAttribute("autocomplete"),
            fields: []
        };
        
        tmpForms.push(tmpFormItem);
    }

    return tmpForms;
}

export const analyzeField = (data: matchingItem) => {

    const testResults = generateEmptyTestResults();

    const logTestResults = false;

    logTestResults && console.log(`Individual TestResults for item: ${data.name}`);
    logTestResults && console.log(data);


    const labelResults = matchByLabel(data);
    logTestResults && console.log(`byLabel: ${data.label}`);
    logTestResults && console.log(labelResults);
    updateTestResults(testResults, labelResults, classesInfluence.matchBy.Label, classesInfluence.testType.Label as testType);
    
    const placeholderResults = matchByPlaceholder(data);
    logTestResults && console.log(`byPlaceholder: ${data.placeholder}`);
    logTestResults && console.log(placeholderResults);
    updateTestResults(testResults, placeholderResults, classesInfluence.matchBy.Placeholder, classesInfluence.testType.Placeholder as testType);

    const fieldTypeResults = matchByFieldType(data);
    logTestResults && console.log(`byFieldType: ${data.fieldType}`);
    logTestResults && console.log(fieldTypeResults);
    updateTestResults(testResults, fieldTypeResults, classesInfluence.matchBy.FieldType, classesInfluence.testType.FieldType as testType);

    const inputTypeResults =  matchByInputType(data);
    logTestResults && console.log(`byInputType: ${data.inputType}`);
    logTestResults && console.log(inputTypeResults);
    updateTestResults(testResults, inputTypeResults, classesInfluence.matchBy.InputType, classesInfluence.testType.InputType as testType);

    const formTypeResults =  matchByFormType(data);
    logTestResults && console.log(`byFormType: ${data.formId}`);
    logTestResults && console.log(formTypeResults);
    updateTestResults(testResults, formTypeResults, classesInfluence.matchBy.FormType, classesInfluence.testType.FormType as testType);

    const inputNameResults =  matchByName(data);
    logTestResults && console.log(`byName: ${data.name}`);
    logTestResults && console.log(inputNameResults);
    updateTestResults(testResults, inputNameResults, classesInfluence.matchBy.Name, classesInfluence.testType.Name as testType);

    const inputIdResults =  matchById(data);
    logTestResults && console.log(`byId: ${data.id}`);
    logTestResults && console.log(inputIdResults);
    updateTestResults(testResults, inputIdResults, classesInfluence.matchBy.Id, classesInfluence.testType.Id as testType);
    

    logTestResults && console.log("--------collected test results unweighted:");
    logTestResults && console.log(testResults);

    const matchingTableResult = weighTestResults(testResults);

    logTestResults && console.log(matchingTableResult);


    /*
    const matchingTableResult = evaluateMatchingClassesResults({
        labelResult: labelResults,
        fieldTypeResult: fieldTypeResults,
        inputTypeResult: inputTypeResults
    });
    */

    //console.log(`classifyresult: ${matchingTableResult}`);

    const sortedMatchingResults = matchingTableResult.sort((a, b) => b.confidenceScore - a.confidenceScore);
    // console.log(sortedMatchingResults);

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


type testType = "inclusive" | "exclusive";
// inclusive tests: no result shall be 0 in confidence
// exclusive test: no result shall not influence confidence

const updateTestResults = (testResults: testResults, newResults: matchByTopResult[], testInfluence: number, testType: testType) => {
    
    // empty list, to be populated with negative test results (0 confidence score)
    const tmpResults: matchByTopResult[] = [...newResults];

    if (testType === "inclusive") {
        
        //TODO evaluate for best results!!!
        for (const key of Object.keys(autocompleteDict.byId)) {
            // if a class (key) is not in newResults, populate tmpResults with 0-entry
            if (!newResults.find(r => r.id === key)) {
                tmpResults.push({
                    id: key,
                    confidence: 0,
                    numOfLanguageMatches: 0
                });
            }
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

    // calculate highest length of all results
    const maxLength = testResults.reduce((maxn, item) => Math.max(maxn, item.resultsAndWeights.length), 0);


    // average of classes, but weigh individual test based on influence
    for (const classResult of testResults) {

        //calculate scaleFactor of individual classResult length
        const scaleFactor = classResult.resultsAndWeights.length / maxLength;

        const weightedSum = classResult.resultsAndWeights.reduce((sum, item) => sum + (item.result * item.weight), 0)
        const summedInfluences = classResult.resultsAndWeights.reduce((sum, item) => sum + item.weight, 0)
        const weigtedResult = weightedSum / summedInfluences;

        // penalize fewer results
        const lengthPenalty = (1 - weigtedResult) * ((1 - scaleFactor) / maxLength) * classesInfluence.lengthPenaltyMultiplier;

        const penalizedResult = weigtedResult - lengthPenalty;

        //table.push({acValue: getNameOfAcId(classResult.classId), acId: classResult.classId, confidenceScore: weigtedResult })
        table.push({acValue: getNameOfAcId(classResult.classId), acId: classResult.classId, confidenceScore: penalizedResult })
        
    } 
    
    return table;
}




export const getHeadingsOfForm = (doc: Document, formId?: string) => {
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

export const getSubmitTextOfForm = (doc: Document, formId?: string) => {
    if (formId === undefined) {
        return null;
    }

    const form = doc.getElementById(formId);
    if (form === null) {
        return null;
    }

    for (const element of ["input", "button"]) {
        const item = form.getElementsByTagName(element);
        for (const h of item) {
            if (h.getAttribute("type") === "submit"){
                if (h.getAttribute("value") !== null) {
                    return h.getAttribute("value");
                }
                return h.innerHTML;
            }
        }
    }

    return null;
}

const isElementInsideTableCell = (element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) => {
    let tmpElement: HTMLElement | null = element;
    while (tmpElement && tmpElement.tagName !== 'HTML') {
      if (tmpElement.tagName === 'TD') {
        return true; // The element is inside a table cell
      }
      tmpElement = tmpElement.parentNode as HTMLElement;
    }
    return false; // The element is not inside a table cell
  }
