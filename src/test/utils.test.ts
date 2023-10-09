import { substringSearch } from "../matching/matchingclasses";


test('substring full match', async () => {
    const substringSearchResult = substringSearch(["telefonnummer"], "telefon nummer");
    expect(substringSearchResult).toBe("full");
});

test('substring multiple words', async () => {
    const substringSearchResult = substringSearch(["telefonnummer"], "Dies ist ein langer Telefonnummer Satz");
    expect(substringSearchResult).toBe("partial");
});

test('substring multiple words fail', async () => {
    const substringSearchResult = substringSearch(["telefonnummer"], "Dies ist ein langer Satz");
    expect(substringSearchResult).toBe("none");
});

test('substring empty word', async () => {
    const substringSearchResult = substringSearch(["telefonnummer"], "");
    expect(substringSearchResult).toBe("none");
});

test('substring empty wordpart', async () => {
    const substringSearchResult = substringSearch(["telefonnummer"], "symbol will be * replaced");
    expect(substringSearchResult).toBe("none");
});

// TODO substring partial/reverse partial



