import { getIdOfAcName, matchingItem } from "../matching/matching";
import { matchByLabel, matchByPlaceholder } from "../matching/matchingclasses";

const emptyMatchingItem: matchingItem = {
    id: null,
    formId: null,
    positionInForm: -1,
    formHeadings: null,
    positionInFields: -1,
    label: null,
    name: null,
    value: null,
    checked: null,
    selectValues: null,
    ariaLabel: null,
    ariaDisabled: null,
    ariaHidden: null,
    inputType: null,
    fieldType: null,
    isInTable: null,
    autocomplete: null,
    correctAutocomplete: null,
    placeholder: null,
    maxLength: null,
    disabled: null,
    required: null,
    pattern: null
};

//byLabel
test('Label: substring full match (DE)', async () => {
    const matchingItem = { ...emptyMatchingItem };
    
    matchingItem.label = "Telefonnummer";

    const labelResults = matchByLabel(matchingItem);
    const sortedLabelResults = labelResults.sort((a, b) => b.confidence - a.confidence);

    expect(sortedLabelResults[0].id).toBe(getIdOfAcName("tel"));
});

//byName
test('Name: substring full match (EN)', async () => {
    const matchingItem = { ...emptyMatchingItem };
    
    matchingItem.placeholder = "transaction amount";

    const labelResults = matchByPlaceholder(matchingItem);
    const sortedLabelResults = labelResults.sort((a, b) => b.confidence - a.confidence);

    expect(sortedLabelResults[0].id).toBe(getIdOfAcName("transaction-amount"));
});