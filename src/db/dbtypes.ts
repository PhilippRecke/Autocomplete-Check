export type dbSiteItem = {
    dataVersion: number;
    url: string;
    date: string;  // ddMMyyyy-mmHH
    hostname: string;  // e.g. hdm-stuttgart.de
    htmlLanguage: string | null;
    htmlTitle: string | null;

    dom: string;

    forms: dbFormItem[];
    looseFields: dbFieldItem[];

    numOfLabeledFields: number;
    numOfFields: number;
    numOfLabeledForms: number;
    numOfForms: number;
}

export type dbSiteItemNoForms = {
    dataVersion: number;
    url: string;
    date: string;  // ddMMyyyy-mmHH
    hostname: string;  // e.g. hdm-stuttgart.de
    htmlLanguage: string | null;
    htmlTitle: string | null;

    dom: string;

    fields: dbFieldItem[];

    numOfLabeledFields: number;
}

export type dbFormItem = {
    id: string | null;
    numOfLabeledFields: number;
    numOfFields: number;
    positionInForms: number;
    headingTexts: string[] | null;  // text-content of headings inside form
    submitText: string  | null;
    autocomplete: string | null;

    fields: dbFieldItem[];
}

export type dbFieldItem = {
    id: string | null;

    formId: string | null;
    positionInForm: number;
    formHeadings: string[] | null;
    positionInFields: number; //global position in all inputs/textareas/selects on site

    label: string | null;
    name: string | null;
    value: string | null;
    checked: boolean | null;
    selectValues: string[]  | null;
    ariaLabel: string | null;
    ariaDisabled: boolean | null;
    ariaHidden: boolean | null;

    inputType: inputType | null;
    fieldType: string | null;

    isInTable: boolean | null;

    autocomplete: string | null;
    correctAutocomplete: string | null;
    
    placeholder: string | null;
    maxLength: number | null;
    disabled: boolean | null;
    required: boolean | null;
    pattern: string | null
}


export type inputType = "button" | "checkbox" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week";

