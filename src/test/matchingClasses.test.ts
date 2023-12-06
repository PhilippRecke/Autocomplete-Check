import { getIdOfAcName, matchingItem } from "../matching/matching";
import { matchByLabel } from "../matching/matchingclasses";

//byLabel
test('substring full match', async () => {
    const matchingItem: matchingItem = {
        id: null,

        formId: null,
        positionInForm: -1,
        formHeadings: null,
        positionInFields: -1,
        label: "Telefonnummer",
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
    
    const labelResults = matchByLabel(matchingItem);
    const sortedLabelResults = labelResults.sort((a, b) => b.confidence - a.confidence);

    expect(sortedLabelResults[0].id).toBe(getIdOfAcName("tel"));
});