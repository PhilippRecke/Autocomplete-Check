import { analyzeField, generateMatchingItem, matchingTable } from "../matching/matching";
import fs from "fs";

const domText = fs.readFileSync("./examplePage/index.html", "utf8");
const domParser = new DOMParser();
const myDocument = domParser.parseFromString(domText, "text/html");


test('first-name field type prediction', async () => {
    const matchingTableResult = await testElementWithId("fname");
    expect(matchingTableResult[0].acValue).toBe("given-name");
});

test('last-name field type prediction', async () => {
    const matchingTableResult = await testElementWithId("lname");
    expect(matchingTableResult[0].acValue).toBe("family-name");
});

test('email field type prediction', async () => {
    const matchingTableResult = await testElementWithId("email");
    expect(matchingTableResult[0].acValue).toBe("email");
});

test('current-password field type prediction', async () => {
    const matchingTableResult = await testElementWithId("pwd");
    expect(matchingTableResult[0].acValue).toBe("current-password");
});

test('countries field type prediction', async () => {
    const matchingTableResult = await testElementWithId("countries");
    expect(matchingTableResult[0].acValue).toBe("country");
});

const testElementWithId = async (id: string) => {
    type acceptedTypes = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const element = myDocument.getElementById(id) as acceptedTypes;

    if (element === null) {
        throw new Error(`Element with id "${id}" was not found in document.`);
    }

    const matchingItem = generateMatchingItem(element, myDocument, -1, -1);
    return analyzeField(matchingItem);
}